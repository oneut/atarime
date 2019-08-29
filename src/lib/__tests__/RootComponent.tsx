import React from "react";
import { RootComponent } from "../RootComponent";
import { connector } from "../Facade";
import { createMemoryHistory } from "history";
import { Page, Route } from "../Page";
import { mount } from "enzyme";
import { asyncFlush } from "../../../test/helpers/Utility";

test("Render component", async (done) => {
  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );

  // Create test component
  class IndexPage extends Page<Route<{}>, {}> {
    component() {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, first page</div>;
  };

  class NextPage extends Page<Route<{}>, {}> {
    component() {
      return <NextComponent />;
    }
  }

  const NextComponent = () => {
    return <div>Hello, next page</div>;
  };

  // RootComponent test
  initializedConnector
    .getRouteMatcher()
    .addRoute("/", Promise.resolve(IndexPage));
  initializedConnector
    .getRouteMatcher()
    .addRoute("/next", Promise.resolve(NextPage));

  initializedConnector.request("/");
  await asyncFlush();

  const mountedActual = mount(
    React.createElement(RootComponent, {
      connector: initializedConnector
    })
  );
  const expectedIndexPage = mount(React.createElement(IndexComponent));
  expect(mountedActual.html()).toBe(expectedIndexPage.html());

  initializedConnector.request("/next");
  await asyncFlush();
  mountedActual.update();

  const expectedNextPage = mount(React.createElement(NextComponent));
  expect(mountedActual.html()).toBe(expectedNextPage.html());
  expect.assertions(2);
  done();
});

test("Render null", (done) => {
  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );

  const mountedActual = mount(
    React.createElement(RootComponent, {
      connector: initializedConnector
    })
  );
  expect(mountedActual.html()).toBeNull();
  expect.assertions(1);
  done();
});
