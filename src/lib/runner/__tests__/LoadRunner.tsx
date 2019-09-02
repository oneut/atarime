import { Page, Route } from "../../Page";
import { connector } from "../../Facade";
import { createMemoryHistory } from "history";
import { mount } from "enzyme";
import * as React from "react";
import { LoadRunner } from "../LoadRunner";

test("Rendering", async (done) => {
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

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  const loadRunner = new LoadRunner(initializedConnector);

  initializedConnector
    .getRouteMatcher()
    .addRoute("/", Promise.resolve(IndexPage));

  loadRunner.run(async (Root) => {
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

  const loadRunner = new LoadRunner(initializedConnector);

  loadRunner.run((Root) => {
    const actual = mount(React.createElement(Root));
    const expected = mount(React.createElement(NotFoundComponent));
    expect(actual.html()).toBe(expected.html());
    expect.assertions(1);
    done();
  });
});
