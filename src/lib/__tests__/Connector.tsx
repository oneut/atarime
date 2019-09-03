import { Connector } from "../Connector";
import { createMemoryHistory } from "history";
import { HistoryManager } from "../HistoryManager";
import { RouteMatcher } from "../RouteMatcher";
import { ComponentResolver } from "../ComponentResolver";
import { Page, PageClass, Route } from "../Page";
import React from "react";
import { asyncFlush } from "../../../test/helpers/Utility";
import { mount } from "enzyme";

test("New initialized instance", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  expect(
    connector.newInitializedInstance(createMemoryHistory())
  ).toBeInstanceOf(Connector);
  expect.assertions(1);
});

test("Add route", (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <div>Hello, World.</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  jest
    .spyOn(routeMatcher, "addRoute")
    .mockImplementation(
      async (
        path: string,
        promisePageClass: Promise<PageClass>,
        name?: string
      ) => {
        expect(path).toBe("/");
        expect(name).toBeUndefined();
        promisePageClass.then((pageClass) => {
          expect(new pageClass(new Route({}, "/"))).toBeInstanceOf(IndexPage);
          done();
        });
      }
    );

  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    routeMatcher,
    new ComponentResolver()
  );

  connector.addRoute("/", Promise.resolve(IndexPage));
  expect.assertions(3);
});

test("Add route with name", (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <div>Hello, World.</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  jest
    .spyOn(routeMatcher, "addRoute")
    .mockImplementation(
      async (
        path: string,
        promisePageClass: Promise<PageClass>,
        name?: string
      ) => {
        expect(path).toBe("/");
        expect(name).toBe("Index");
        promisePageClass.then((pageClass) => {
          expect(new pageClass(new Route({}, "/"))).toBeInstanceOf(IndexPage);
          done();
        });
      }
    );

  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    routeMatcher,
    new ComponentResolver()
  );

  connector.addRoute("/", Promise.resolve(IndexPage), "Index");
  expect.assertions(3);
});

test("Next request", async (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World.</div>;
  };

  class NextPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <NextComponent />;
    }
  }

  const NextComponent = () => {
    return <div>Next, World.</div>;
  };

  const componentResolver = new ComponentResolver();

  const connector = new Connector(
    new HistoryManager(
      createMemoryHistory({
        initialEntries: ["/"]
      })
    ),
    new RouteMatcher(),
    componentResolver
  );

  connector.addRoute("/", Promise.resolve(IndexPage));
  connector.addRoute("/next", Promise.resolve(NextPage));
  connector.nextRequest("/next");
  await asyncFlush();
  const component = componentResolver.getComponent();
  if (!component) return;
  const actual = mount(React.createElement(component));
  const expected = mount(React.createElement(NextComponent));
  expect(actual.html()).toBe(expected.html());
  done();
});

test("Push history", async (done) => {
  const historyManager = new HistoryManager(createMemoryHistory());
  jest
    .spyOn(historyManager, "push")
    .mockImplementation((to: string, callback: () => void) => {
      expect(to).toBe("/");
      callback();
    });

  const connector = new Connector(
    historyManager,
    new RouteMatcher(),
    new ComponentResolver()
  );

  const checkCallback = jest.fn();
  connector.pushHistory("/", () => {
    checkCallback();
  });

  expect(checkCallback).toHaveBeenCalled();
  expect.assertions(2);
  done();
});

test("Push history by name", () => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <div>Hello, World.</div>;
    }
  }

  const historyManager = new HistoryManager(createMemoryHistory());
  jest
    .spyOn(historyManager, "push")
    .mockImplementation((to: string, callback: () => void) => {
      expect(to).toBe("/1");
      callback();
    });

  const connector = new Connector(
    historyManager,
    new RouteMatcher(),
    new ComponentResolver()
  );

  connector.addRoute("/:id", Promise.resolve(IndexPage), "Show");

  const checkCallback = jest.fn();
  connector.pushHistoryByName("Show", { id: 1 }, () => {
    checkCallback();
  });

  expect(checkCallback).toHaveBeenCalled();
  expect.assertions(2);
});

test("Is current pathname", async (done) => {
  const connector = new Connector(
    new HistoryManager(
      createMemoryHistory({
        initialEntries: ["/"]
      })
    ),
    new RouteMatcher(),
    new ComponentResolver()
  );

  expect(connector.isCurrentPathname("/")).toBeTruthy();
  expect(connector.isCurrentPathname("/next")).toBeFalsy();
  expect.assertions(2);
  done();
});

test("Create href", () => {
  const historyManager = new HistoryManager(createMemoryHistory());
  jest
    .spyOn(historyManager, "createHref")
    .mockImplementation((pathname: string) => {
      expect(pathname).toBe("/");
      return "";
    });

  const connector = new Connector(
    historyManager,
    new RouteMatcher(),
    new ComponentResolver()
  );

  connector.createHref("/");
  expect.assertions(1);
});

test("Create href by name", () => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <div>Hello, World.</div>;
    }
  }

  const historyManager = new HistoryManager(createMemoryHistory());
  jest
    .spyOn(historyManager, "createHref")
    .mockImplementation((pathname: string) => {
      expect(pathname).toBe("/1");
      return "";
    });

  const connector = new Connector(
    historyManager,
    new RouteMatcher(),
    new ComponentResolver()
  );

  connector.addRoute("/:id", Promise.resolve(IndexPage), "Index");

  connector.createHrefByName("Index", { id: 1 });
  expect.assertions(1);
});

test("Run on client", async (done) => {
  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "World!"
      };
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>Hello, {props.message}</div>;
  };

  const connector = new Connector(
    new HistoryManager(
      createMemoryHistory({
        initialEntries: ["/"]
      })
    ),
    new RouteMatcher(),
    new ComponentResolver()
  );

  connector.addRoute("/", Promise.resolve(IndexPage));

  connector.run(async (Root) => {
    const actual = mount(React.createElement(Root));
    const expected = mount(
      React.createElement(IndexComponent, {
        message: "World!"
      })
    );
    expect(actual.html()).toBe(expected.html());
    expect.assertions(1);
    done();
  });
});

test("Run with initial props on client", async (done) => {
  interface InitialProps {
    message: string;
  }

  const checkFunction = jest.fn();

  class IndexPage extends Page<Route<{}>, InitialProps> {
    initialPropsWillGet() {
      checkFunction();
    }

    async getInitialProps() {
      checkFunction();
      return {};
    }

    initialPropsDidGet(initialProps: InitialProps) {
      checkFunction();
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>Hello, {props.message}</div>;
  };

  const connector = new Connector(
    new HistoryManager(
      createMemoryHistory({
        initialEntries: ["/"]
      })
    ),
    new RouteMatcher(),
    new ComponentResolver()
  );

  connector.addRoute("/", Promise.resolve(IndexPage));

  connector.runWithInitialProps({ message: "World!" }, async (Root) => {
    const actual = mount(React.createElement(Root));
    const expected = mount(
      React.createElement(IndexComponent, {
        message: "World!"
      })
    );
    expect(actual.html()).toBe(expected.html());
    expect(checkFunction).not.toHaveBeenCalled();
    expect.assertions(2);
    done();
  });
});

test("Run with first component on client", async (done) => {
  const FirstComponent = () => {
    return <div>First Component.</div>;
  };

  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "World!"
      };
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>Hello, {props.message}</div>;
  };

  const connector = new Connector(
    new HistoryManager(
      createMemoryHistory({
        initialEntries: ["/"]
      })
    ),
    new RouteMatcher(),
    new ComponentResolver()
  );

  connector.addRoute("/", Promise.resolve(IndexPage));
  connector.runWithFirstComponent(FirstComponent, async (Root) => {
    const actual = mount(React.createElement(Root));
    const firstExpected = mount(React.createElement(FirstComponent));
    expect(actual.html()).toBe(firstExpected.html());
    await asyncFlush();
    actual.update();
    const secondExpected = mount(
      React.createElement(IndexComponent, {
        message: "World!"
      })
    );
    expect(actual.html()).toBe(secondExpected.html());
    expect.assertions(2);
    done();
  });
});

test("Resolve component by pathname", async (done) => {
  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "World!"
      };
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>Hello, {props.message}</div>;
  };

  const connector = new Connector(
    new HistoryManager(
      createMemoryHistory({
        initialEntries: ["/"]
      })
    ),
    new RouteMatcher(),
    new ComponentResolver()
  );

  connector.addRoute("/", Promise.resolve(IndexPage));
  connector.resolveComponentByPathname("/", async (Root) => {
    const actual = mount(React.createElement(Root));
    const expected = mount(
      React.createElement(IndexComponent, {
        message: "World!"
      })
    );
    expect(actual.html()).toBe(expected.html());
    expect.assertions(1);
    done();
  });
});
