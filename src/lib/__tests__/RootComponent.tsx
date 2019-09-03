import React from "react";
import { RootComponent } from "../RootComponent";
import { mount } from "enzyme";
import { ComponentResolver } from "../ComponentResolver";

test("Render component", async (done) => {
  const componentResolver = new ComponentResolver();

  const IndexComponent = () => {
    return <div>Hello, first page</div>;
  };

  const NextComponent = () => {
    return <div>Hello, next page</div>;
  };

  componentResolver.setComponent(IndexComponent);
  const actual = mount(
    React.createElement(RootComponent, {
      componentResolver: componentResolver
    })
  );
  const expectedIndexPage = mount(React.createElement(IndexComponent));
  expect(actual.html()).toBe(expectedIndexPage.html());

  componentResolver.setComponent(NextComponent).changeState();
  actual.update();

  const expectedNextPage = mount(React.createElement(NextComponent));
  expect(actual.html()).toBe(expectedNextPage.html());
  expect.assertions(2);
  done();
});

test("Render null", (done) => {
  const componentResolver = new ComponentResolver();
  const actual = mount(
    React.createElement(RootComponent, {
      componentResolver: componentResolver
    })
  );
  expect(actual.html()).toBeNull();
  expect.assertions(1);
  done();
});
