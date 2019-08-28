import React from "react";
import { ComponentResolver } from "../ComponentResolver";
import { Renderer } from "../Renderer";
import { mount } from "enzyme";
import { Page, Route } from "../Page";

test("Default component", () => {
  const componentResolver = new ComponentResolver();
  expect(componentResolver.getComponent()).toBeUndefined();
});

test("Set component", () => {
  expect.assertions(2);

  class TestComponent extends React.Component {
    render() {
      return <div>Test component</div>;
    }
  }

  const componentResolver = new ComponentResolver();
  componentResolver.setComponent(TestComponent);
  const component = componentResolver.getComponent();
  expect(component).not.toBeUndefined();
  if (typeof component === "undefined") {
    return;
  }
  const actual = mount(React.createElement(component));
  const expected = mount(React.createElement(TestComponent));
  expect(actual.html()).toBe(expected.html());
});

test("Set component from renderer", () => {
  expect.assertions(2);

  interface RouteParams {
    id: number;
  }

  interface Props {
    route: Route<RouteParams>;
  }

  class TestComponent extends React.Component<Props> {
    render() {
      return (
        <div>
          <div>pathname: {this.props.route.pathname}</div>
          <div>id: {this.props.route.params.id}</div>
        </div>
      );
    }
  }

  class TestPage extends Page<Route<RouteParams>, {}> {
    component() {
      return <TestComponent route={this.route} />;
    }
  }

  const pathname = "/1";
  const params = {
    id: 1
  };

  const renderer = new Renderer(new TestPage(new Route(params, pathname)));

  const componentResolver = new ComponentResolver();
  componentResolver.setComponentFromRenderer(renderer);

  const Component = componentResolver.getComponent();
  expect(Component).not.toBeUndefined();
  if (typeof Component === "undefined") {
    return;
  }
  const actual = mount(React.createElement(Component));
  const expected = mount(
    React.createElement(TestComponent, {
      route: {
        _route: undefined,
        pathname: "/1",
        params: {
          id: 1
        }
      }
    })
  );
  expect(actual.html()).toBe(expected.html());
});
