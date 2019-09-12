import { createMemoryHistory } from "history";
import React from "react";
import { mount } from "enzyme";
import { Page, PageClass } from "../../lib/Page";
import { connector } from "../../lib/Facade";
import ServerRouter from "../ServerRouter";
import { Route } from "../..";

test("Route", (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component() {
      return <div>Hello, World.</div>;
    }
  }

  const initializedConnector = connector.initialize(createMemoryHistory());

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

  const router = new ServerRouter(initializedConnector);

  router.route("/", IndexPage, "Index");
  expect.assertions(3);
});

test("Async route", (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component() {
      return <div>Hello, World.</div>;
    }
  }

  const initializedConnector = connector.initialize(createMemoryHistory());

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

  const router = new ServerRouter(initializedConnector);

  router.asyncRoute("/", () => Promise.resolve(IndexPage), "Index");
  expect.assertions(3);
});

test("Resolve component by pathname", () => {
  interface InitialProps {
    message: string;
  }

  const TestComponent = () => {
    return <div>Test</div>;
  };

  const initializedConnector = connector.initialize(createMemoryHistory());
  jest
    .spyOn(initializedConnector, "resolveComponentByPathname")
    .mockImplementation(
      (
        pathname: string,
        callback: (Root: React.FunctionComponent<{}>, initialProps: {}) => void
      ) => {
        expect(pathname).toBe("/");
        callback(TestComponent, { message: "Hello, World!" });
      }
    );

  const router = new ServerRouter(initializedConnector);
  router.resolveComponentByPathname(
    "/",
    (RootComponent, initialProps: InitialProps) => {
      const actual = mount(<RootComponent />);
      const expected = mount(<TestComponent />);
      expect(actual.html()).toBe(expected.html());
      expect(initialProps.message).toBe("Hello, World!");
      expect.assertions(3);
    }
  );
});
