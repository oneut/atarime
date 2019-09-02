import { Page, Route } from "../../Page";
import * as React from "react";
import { InitialPropsLoadRunner } from "../InitialPropsLoadRunner";
import { connector } from "../../Facade";
import { createMemoryHistory } from "history";
import { mount } from "enzyme";

test("Rendering", async (done) => {
  interface InitialProps {
    message: "World!";
  }

  const checkCallFn = jest.fn();

  class IndexPage extends Page<Route<{}>, InitialProps> {
    initialPropsWillGet() {
      checkCallFn();
    }

    async getInitialProps() {
      checkCallFn();
      return {};
    }

    initialPropsDidGet(initialProps: InitialProps) {
      checkCallFn();
    }

    component(initialProps: InitialProps) {
      return <IndexComponent message={initialProps.message} />;
    }
  }

  const IndexComponent = (props: InitialProps) => {
    return <div>Hello, {props.message}</div>;
  };

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  initializedConnector
    .getRouteMatcher()
    .addRoute("/", Promise.resolve(IndexPage));

  const initialPropsLoadRunner = new InitialPropsLoadRunner(
    initializedConnector,
    { message: "World!" }
  );
  initialPropsLoadRunner.run(async (Root) => {
    const actual = mount(React.createElement(Root));
    const expected = mount(
      React.createElement(IndexComponent, { message: "World!" })
    );
    expect(actual.html()).toBe(expected.html());
    expect(checkCallFn).not.toHaveBeenCalled();
    expect.assertions(2);
    done();
  });
});

test("Not found page", async (done) => {
  class NotFoundPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <NotFoundComponent />;
    }
  }

  const NotFoundComponent = (props: {}) => {
    return <div>Not Found.</div>;
  };

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory({
      initialEntries: ["/not-found"]
    })
  );
  initializedConnector
    .getRouteMatcher()
    .addRoute("(.*)", Promise.resolve(NotFoundPage));

  const initialPropsLoadRunner = new InitialPropsLoadRunner(
    initializedConnector,
    {}
  );

  initialPropsLoadRunner.run((Root) => {
    const actual = mount(React.createElement(Root));
    const expected = mount(React.createElement(NotFoundComponent));
    expect(actual.html()).toBe(expected.html());
    expect.assertions(1);
    done();
  });
});
