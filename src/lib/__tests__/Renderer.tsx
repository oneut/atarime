import React from "react";
import { mount } from "enzyme";
import { Page } from "../Page";
import { Renderer } from "../Renderer";
import { Route } from "../Route";

test("Get component", () => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World.</div>;
  };

  const route = new Route({}, "/");
  const indexPage = new IndexPage(route);
  const renderer = new Renderer(indexPage);
  const component = renderer.getComponent();
  const actual = mount(React.createElement(component));
  const expected = mount(React.createElement(IndexComponent));

  expect(actual.html()).toBe(expected.html());
  expect.assertions(1);
});

test("Get default component props", () => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World.</div>;
  };

  const route = new Route({}, "/");
  const indexPage = new IndexPage(route);
  const renderer = new Renderer(indexPage);
  expect(renderer.getComponentProps()).toMatchObject({});
  expect.assertions(1);
});

test("Fire initialPropsWillGet()", () => {
  const checkInitialPropsWillGet = jest.fn();
  class IndexPage extends Page<Route<{}>, {}> {
    initialPropsWillGet() {
      checkInitialPropsWillGet();
    }

    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World.</div>;
  };

  const route = new Route({}, "/");
  const indexPage = new IndexPage(route);
  const renderer = new Renderer(indexPage);
  renderer.fireInitialPropsWillGet();
  expect(checkInitialPropsWillGet).toHaveBeenCalled();
  expect.assertions(1);
});

test("Fire getInitialProps()", async (done) => {
  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    async getInitialProps() {
      return {
        message: "Hello, World."
      };
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>{props.message}</div>;
  };

  const route = new Route({}, "/");
  const indexPage = new IndexPage(route);
  const renderer = new Renderer(indexPage);
  await renderer.fireGetInitialProps();
  const component = renderer.getComponent();
  const actual = mount(React.createElement(component));
  const expected = mount(
    React.createElement(IndexComponent, { message: "Hello, World." })
  );
  expect(actual.html()).toBe(expected.html());
  expect.assertions(1);
  done();
});

test("Fire initialPropsDidGet()", () => {
  const checkInitialPropsDidGet = jest.fn();
  class IndexPage extends Page<Route<{}>, {}> {
    initialPropsDidGet() {
      checkInitialPropsDidGet();
    }

    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World.</div>;
  };

  const route = new Route({}, "/");
  const indexPage = new IndexPage(route);
  const renderer = new Renderer(indexPage);
  renderer.fireInitialPropsDidGet();
  expect(checkInitialPropsDidGet).toHaveBeenCalled();
  expect.assertions(1);
});

test("Fire requestCallBack()", () => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World.</div>;
  };

  const route = new Route({}, "/");
  const indexPage = new IndexPage(route);

  const checkRequestCallback = jest.fn();
  const requestCallback = () => {
    checkRequestCallback();
  };
  const renderer = new Renderer(indexPage, requestCallback);
  expect(renderer.fireRequestCallback()).toBeInstanceOf(Renderer);
  expect(checkRequestCallback).toHaveBeenCalled();
  expect.assertions(2);
});

test("Fire default requestCallBack()", () => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = () => {
    return <div>Hello, World.</div>;
  };

  const route = new Route({}, "/");
  const indexPage = new IndexPage(route);

  const renderer = new Renderer(indexPage);
  expect(renderer.fireRequestCallback()).toBeInstanceOf(Renderer);
  expect.assertions(1);
});

test("Set initialProps", async (done) => {
  interface InitialProps {
    message: string;
  }

  class IndexPage extends Page<Route<{}>, InitialProps> {
    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>{props.message}</div>;
  };

  const route = new Route({}, "/");
  const indexPage = new IndexPage(route);
  const renderer = new Renderer(indexPage);
  await renderer.fireGetInitialProps();
  renderer.setInitialProps({ message: "Hello, World." });
  const component = renderer.getComponent();
  const actual = mount(React.createElement(component));
  const expected = mount(
    React.createElement(IndexComponent, { message: "Hello, World." })
  );
  expect(actual.html()).toBe(expected.html());
  expect.assertions(1);
  done();
});

test("Set initialProps to undefined", async (done) => {
  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <IndexComponent />;
    }
  }

  const IndexComponent = (props: {}) => {
    return <div>Hello, World.</div>;
  };

  const route = new Route({}, "/");
  const indexPage = new IndexPage(route);
  const renderer = new Renderer(indexPage);
  await renderer.fireGetInitialProps();
  renderer.setInitialProps(undefined);
  const component = renderer.getComponent();
  const actual = mount(React.createElement(component));
  const expected = mount(React.createElement(IndexComponent));
  expect(actual.html()).toBe(expected.html());
  expect.assertions(1);
  done();
});
