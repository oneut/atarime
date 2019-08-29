import React from "react";
import { createMemoryHistory } from "history";
import { connector } from "../Facade";
import { HistoryManager } from "../HistoryManager";
import { RouteMatcher } from "../RouteMatcher";
import { ComponentResolver } from "../ComponentResolver";
import { Page, Route } from "../Page";
import { mount } from "enzyme";
import { asyncFlush } from "../../../test/helpers/Utility";

test("Get History Manager", () => {
  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  expect(initializedConnector.getHistoryManager()).toBeInstanceOf(
    HistoryManager
  );
});

test("Get RouteMatcher", () => {
  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  expect(initializedConnector.getRouteMatcher()).toBeInstanceOf(RouteMatcher);
});

test("Get ComponentResolver", () => {
  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  expect(initializedConnector.getComponentResolver()).toBeInstanceOf(
    ComponentResolver
  );
});

test("Request", async (done) => {
  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "Hello, World"
      };
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>{props.message}</div>;
  };

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  initializedConnector
    .getRouteMatcher()
    .addRoute("/", Promise.resolve(IndexPage));

  const Component = initializedConnector.getComponentResolver().getComponent();
  expect(Component).toBeUndefined();

  initializedConnector.request("/");

  await asyncFlush();

  const NextComponent = initializedConnector
    .getComponentResolver()
    .getComponent();
  expect(NextComponent).not.toBeUndefined();
  if (typeof NextComponent === "undefined") {
    return;
  }

  const actual = mount(React.createElement(NextComponent));
  const expected = mount(
    React.createElement(IndexComponent, { message: "Hello, World" })
  );
  expect(actual.html()).toBe(expected.html());

  expect.assertions(3);
  done();
});

test("Request with callback & Subscribe", async (done) => {
  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "Hello, World"
      };
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>{props.message}</div>;
  };

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  initializedConnector
    .getRouteMatcher()
    .addRoute("/", Promise.resolve(IndexPage));

  const mockSubscribeFn = jest.fn();
  initializedConnector.subscribe(() => {
    mockSubscribeFn();
    expect(mockSubscribeFn).toHaveBeenCalled();
  });

  const Component = initializedConnector.getComponentResolver().getComponent();
  expect(Component).toBeUndefined();

  const mockRequestCallbackFn = jest.fn();
  initializedConnector.request("/", () => {
    mockRequestCallbackFn();
    expect(mockRequestCallbackFn).toHaveBeenCalled();
  });

  await asyncFlush();

  const NextComponent = initializedConnector
    .getComponentResolver()
    .getComponent();
  expect(NextComponent).not.toBeUndefined();
  if (typeof NextComponent === "undefined") {
    return;
  }

  const actual = mount(React.createElement(NextComponent));
  const expected = mount(
    React.createElement(IndexComponent, { message: "Hello, World" })
  );
  expect(actual.html()).toBe(expected.html());

  expect.assertions(5);
  done();
});

test("Request without callback & Subscribe", async (done) => {
  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "Hello, World"
      };
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>{props.message}</div>;
  };

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  initializedConnector
    .getRouteMatcher()
    .addRoute("/", Promise.resolve(IndexPage));

  const mockSubscribeFn = jest.fn();
  initializedConnector.subscribe(() => {
    mockSubscribeFn();
    expect(mockSubscribeFn).toHaveBeenCalled();
  });

  const Component = initializedConnector.getComponentResolver().getComponent();
  expect(Component).toBeUndefined();

  initializedConnector.request("/");

  await asyncFlush();

  const NextComponent = initializedConnector
    .getComponentResolver()
    .getComponent();
  expect(NextComponent).not.toBeUndefined();
  if (typeof NextComponent === "undefined") {
    return;
  }

  const actual = mount(React.createElement(NextComponent));
  const expected = mount(
    React.createElement(IndexComponent, { message: "Hello, World" })
  );
  expect(actual.html()).toBe(expected.html());

  expect.assertions(4);
  done();
});
