import React from "react";
import { RouteMatcher } from "../RouteMatcher";
import { Page, Route } from "../Page";
import { mount } from "enzyme";

test("New instance", () => {
  const routeMatcher = new RouteMatcher();
  expect(routeMatcher.newInstance()).toBeInstanceOf(RouteMatcher);
});

test("Add route", () => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/", Promise.resolve(IndexPage));
});

test("Create renderer", async (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World</div>;
  };

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/", Promise.resolve(IndexPage));
  const renderer = await routeMatcher.createRenderer("/");
  expect(renderer).not.toBeUndefined();
  if (!renderer) return;
  const actual = mount(renderer.getComponent());
  const expected = mount(React.createElement(IndexComponent));
  expect(actual.html()).toBe(expected.html());
  expect.assertions(2);
  done();
});

test("Create renderer with request callback", async (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World</div>;
  };

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/", Promise.resolve(IndexPage));
  const mockRequestCallbackFn = jest.fn();
  const renderer = await routeMatcher.createRenderer("/", () => {
    mockRequestCallbackFn();
    expect(mockRequestCallbackFn).toBeCalled();
  });
  expect(renderer).not.toBeUndefined();
  if (!renderer) return;
  const actual = mount(renderer.getComponent());
  const expected = mount(React.createElement(IndexComponent));
  expect(actual.html()).toBe(expected.html());

  renderer.fireRequestCallback();

  expect.assertions(3);
  done();
});

test("Create renderer if pathname is no match", async (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World</div>;
  };

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/", Promise.resolve(IndexPage));
  const renderer = await routeMatcher.createRenderer("/no-match");
  expect(renderer).toBeNull();
  done();
});

test("Create renderer with dynamic routing", async (done) => {
  interface RouteParams {
    id: number;
    name: string;
  }

  class IndexPage extends Page<Route<RouteParams>, {}> {
    component(initialProps: {}) {
      expect(this.route.params.id).toBe(1);
      expect(this.route.params.name).toBe("Jack");
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World</div>;
  };

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/:id/:name", Promise.resolve(IndexPage));
  const renderer = await routeMatcher.createRenderer("/1/Jack");
  expect(renderer).not.toBeUndefined();
  if (!renderer) return;
  const actual = mount(renderer.getComponent());
  const expected = mount(React.createElement(IndexComponent));
  expect(actual.html()).toBe(expected.html());
  expect.assertions(4);
  done();
});

test("Compile by name", () => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/", Promise.resolve(IndexPage), "Index");
  expect(routeMatcher.compileByName("Index")).toBe("/");
});

test("Compile by name with url parameters", () => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <div>Hello, World</div>;
    }
  }

  const routeMatcher = new RouteMatcher();
  routeMatcher.addRoute("/:id", Promise.resolve(IndexPage), "Index");
  expect(routeMatcher.compileByName("Index", { id: 1 })).toBe("/1");
});

test("Error compile by name", () => {
  expect(() => {
    const routeMatcher = new RouteMatcher();
    routeMatcher.compileByName("test");
  }).toThrowError(`Route Name "test" did not match Path.`);
});
