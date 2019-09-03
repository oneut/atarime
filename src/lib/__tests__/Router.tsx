import React from "react";
import { mount } from "enzyme";
import { Router } from "../Router";
import { Page, PageClass, Route } from "../Page";
import { connector } from "../Facade";
import { createMemoryHistory } from "history";
import { asyncFlush } from "../../test/helpers/Utility";

test("Run", () => {
  const TestComponent = () => {
    return <div>Test</div>;
  };

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  jest
    .spyOn(initializedConnector, "run")
    .mockImplementation(
      (callback: (Root: React.FunctionComponent<{}>) => void) => {
        callback(TestComponent);
      }
    );

  const router = new Router(initializedConnector);
  router.run((RootComponent) => {
    const actual = mount(<RootComponent />);
    const expected = mount(<TestComponent />);
    expect(actual.html()).toBe(expected.html());
    expect.assertions(1);
  });
});

test("Run with first component", () => {
  const FirstComponent = () => {
    return <div>First</div>;
  };

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  jest
    .spyOn(initializedConnector, "runWithFirstComponent")
    .mockImplementation(
      (
        firstComponent: React.ComponentType,
        callback: (Root: React.FunctionComponent<{}>) => void
      ) => {
        const actual = mount(React.createElement(firstComponent));
        const expected = mount(<FirstComponent />);
        expect(actual.html()).toBe(expected.html());
        callback(FirstComponent);
      }
    );

  const router = new Router(initializedConnector);
  router.runWithFirstComponent(FirstComponent, (Root) => {
    const actual = mount(<Root />);
    const expected = mount(<FirstComponent />);
    expect(actual.html()).toBe(expected.html());
  });
  expect.assertions(2);
});

test("Run with initial props", () => {
  const TestComponent = () => {
    return <div>Test</div>;
  };

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  jest
    .spyOn(initializedConnector, "runWithInitialProps")
    .mockImplementation(
      (
        initialProps: {},
        callback: (Root: React.FunctionComponent<{}>) => void
      ) => {
        expect(initialProps).toStrictEqual({ items: ["foo", "bar", "baz"] });
        callback(TestComponent);
      }
    );

  const router = new Router(initializedConnector);
  router.runWithInitialProps(
    { items: ["foo", "bar", "baz"] },
    async (RootComponent) => {
      const actual = mount(React.createElement(RootComponent));
      const expected = mount(React.createElement(TestComponent));
      expect(actual.html()).toBe(expected.html());
    }
  );
  expect.assertions(2);
});

test("Route", (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component() {
      return <div>Hello, World.</div>;
    }
  }

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );

  jest
    .spyOn(initializedConnector, "addRoute")
    .mockImplementation(
      (path: string, promisePageClass: Promise<PageClass>, name?: string) => {
        expect(path).toBe("/");
        expect(name).toBe("Index");
        promisePageClass.then((pageClass) => {
          expect(new pageClass(new Route({}, "/"))).toBeInstanceOf(IndexPage);
          done();
        });
      }
    );

  const router = new Router(initializedConnector);

  router.route("/", IndexPage, "Index");
  expect.assertions(3);
});

test("Async route", (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component() {
      return <div>Hello, World.</div>;
    }
  }

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );

  jest
    .spyOn(initializedConnector, "addRoute")
    .mockImplementation(
      (path: string, promisePageClass: Promise<PageClass>, name?: string) => {
        expect(path).toBe("/");
        expect(name).toBe("Index");
        promisePageClass.then((pageClass) => {
          expect(new pageClass(new Route({}, "/"))).toBeInstanceOf(IndexPage);
          done();
        });
      }
    );

  const router = new Router(initializedConnector);

  // Use promise instead of dynamic import
  router.asyncRoute("/", () => Promise.resolve(IndexPage), "Index");
  expect.assertions(3);
});

test("Route & Run", (done) => {
  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "World."
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
        nextMessage: "Next World!"
      };
    }

    initialPropsDidGet(initialProps: NextInitialProps) {
      expect(initialProps.nextMessage).toBe("Next World!");
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
      React.createElement(IndexComponent, { message: "World." })
    );
    expect(mountedActual.html()).toBe(firstExpected.html());

    // wait to resolve promise.
    await asyncFlush();

    // next rendering
    initializedConnector.nextRequest("/next");

    // wait to resolve promise.
    await asyncFlush();

    // renderer update
    await mountedActual.update();
    const nextExpected = mount(
      React.createElement(NextComponent, { nextMessage: "Next World!" })
    );
    expect(mountedActual.html()).toBe(nextExpected.html());
    done();
  });
  expect.assertions(5);
});
