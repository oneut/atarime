import React from "react";
import { mount } from "enzyme";
import { Router } from "../Router";
import { Page, Route } from "../Page";
import { connector } from "../Facade";
import { createMemoryHistory } from "history";
import { asyncFlush } from "../../../test/helpers/Utility";

test("Rendering", (done) => {
  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    initialPropsWillGet() {
      expect(this.route.pathname).toBe("/");
    }

    async getInitialProps() {
      expect(this.route.pathname).toBe("/");
      return {
        message: "world"
      };
    }

    initialPropsDidGet(initialProps: InitialProps) {
      expect(this.route.pathname).toBe("/");
      expect(initialProps.message).toBe("world");
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>Hello, {props.message}</div>;
  };

  const router = new Router(
    connector.newInitializedInstance(createMemoryHistory())
  );

  router.route("/", IndexPage);
  router.run(async (RootComponent) => {
    const actual = mount(<RootComponent />);
    const expected = mount(
      React.createElement(IndexComponent, { message: "world" })
    );
    expect(actual.html()).toBe(expected.html());
    expect.assertions(5);
    done();
  });
});

test("Rendering with first component", async (done) => {
  interface InitialProps {
    message: string;
  }

  class FirstPage extends React.Component {
    render() {
      return <div>first page</div>;
    }
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "world"
      };
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>Hello, {props.message}</div>;
  };

  const router = new Router(
    connector.newInitializedInstance(createMemoryHistory())
  );

  router.route("/", IndexPage);
  router.runWithFirstComponent(FirstPage, async (Root) => {
    // The Router use RxJS to control async/await.
    // So, First Rendering is null.
    const mountedActual = mount(<Root />);
    const firstExpected = mount(<FirstPage />);
    expect(mountedActual.html()).toBe(firstExpected.html());

    // wait to resolve promise.
    await asyncFlush();

    mountedActual.update();
    const expected = mount(<IndexComponent message={"world"} />);
    expect(mountedActual.html()).toBe(expected.html());
    expect.assertions(2);
    done();
  });
});

test("Rendering with initial props", (done) => {
  const mockFn = jest.fn();

  interface InitialProps {
    items: string[];
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    static initialPropsWillGet() {
      expect(mockFn).not.toHaveBeenCalled();
    }

    static async getInitialProps() {
      expect(mockFn).not.toHaveBeenCalled();
    }

    static initialPropsDidGet() {
      expect(mockFn).not.toHaveBeenCalled();
    }

    component(initialProps: InitialProps) {
      return <IndexComponent items={initialProps.items} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return (
      <div>
        <h1>Index</h1>
        <ul>
          {props.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  const router = new Router(
    connector.newInitializedInstance(createMemoryHistory())
  );
  router.route("/", IndexPage);
  router.runWitInitialProps(
    { items: ["foo", "bar", "baz"] },
    async (RootComponent) => {
      const actual = mount(React.createElement(RootComponent));
      const expected = mount(
        React.createElement(IndexComponent, { items: ["foo", "bar", "baz"] })
      );

      expect(actual.html()).toBe(expected.html());
      expect.assertions(1);
      done();
    }
  );
});

test("Match single route", (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component() {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World</div>;
  };

  const router = new Router(
    connector.newInitializedInstance(createMemoryHistory())
  );

  router.route("/", IndexPage);
  router.run(async (RootComponent) => {
    const actual = mount(<RootComponent />);
    const expected = mount(<IndexComponent />);
    expect(actual.html()).toBe(expected.html());
    done();
  });
});

test("Next rendering from Request `to`", (done) => {
  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "world"
      };
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>Hello, {props.message}</div>;
  };

  interface NextInitialProps {
    nextMessage: string;
  }

  class NextPage extends Page<Route<{}>, NextInitialProps> {
    initialPropsWillGet() {
      expect(this.route.pathname).toBe("/next");
    }

    async getInitialProps() {
      expect(this.route.pathname).toBe("/next");
      return {
        nextMessage: "next world"
      };
    }

    initialPropsDidGet(initialProps: NextInitialProps) {
      expect(initialProps.nextMessage).toBe("next world");
    }

    component(initialProps: NextInitialProps) {
      return <NextComponent nextMessage={initialProps.nextMessage} />;
    }
  }

  const NextComponent = (props: NextInitialProps): React.ReactElement => {
    return <div>Hello, {props.nextMessage}</div>;
  };

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  const router = new Router(initializedConnector);

  router.route("/", IndexPage);
  router.route("/next", NextPage);
  router.run(async (RootComponent) => {
    // Test up to call renderer.
    const mountedActual = mount(React.createElement(RootComponent));
    const firstExpected = mount(
      React.createElement(IndexComponent, { message: "world" })
    );
    expect(mountedActual.html()).toBe(firstExpected.html());

    // wait to resolve promise.
    await asyncFlush();

    // next rendering
    initializedConnector.request("/next");

    // wait to resolve promise.
    await asyncFlush();

    // renderer update
    await mountedActual.update();
    const nextExpected = mount(
      React.createElement(NextComponent, { nextMessage: "next world" })
    );
    expect(mountedActual.html()).toBe(nextExpected.html());

    done();
  });

  expect.assertions(5);
});

test("Async route", async (done) => {
  interface InitialProps {
    message: string;
  }

  class DynamicImportPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "Dynamic import"
      };
    }

    component(initialProps: InitialProps) {
      return <Component message={initialProps.message} />;
    }
  }

  const Component = (props: InitialProps) => {
    return <div>{props.message}</div>;
  };

  const router = new Router(
    connector.newInitializedInstance(createMemoryHistory())
  );

  // Use promise instead of dynamic import
  router.asyncRoute("/", () => Promise.resolve(DynamicImportPage));
  router.run(async (RootComponent) => {
    const actual = mount(React.createElement(RootComponent));
    const expected = mount(<Component message={"Dynamic import"} />);
    expect(actual.html()).toBe(expected.html());
    done();
  });
});
