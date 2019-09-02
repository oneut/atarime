import { FirstComponentLoadRunner } from "../FirstComponentLoadRunner";
import { connector } from "../../Facade";
import { createMemoryHistory } from "history";
import { mount } from "enzyme";
import * as React from "react";
import { Page, Route } from "../../Page";
import { asyncFlush } from "../../../../test/helpers/Utility";

test("Rendering", async (done) => {
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

  const initializedConnector = connector.newInitializedInstance(
    createMemoryHistory()
  );
  const firstComponentLoadRunner = new FirstComponentLoadRunner(
    initializedConnector,
    FirstComponent
  );

  initializedConnector
    .getRouteMatcher()
    .addRoute("/", Promise.resolve(IndexPage));

  firstComponentLoadRunner.run(async (Root) => {
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

test("Not found page", async (done) => {
  const FirstComponent = () => {
    return <div>First Component.</div>;
  };

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
  const firstComponentLoadRunner = new FirstComponentLoadRunner(
    initializedConnector,
    FirstComponent
  );

  initializedConnector
    .getRouteMatcher()
    .addRoute("(.*)", Promise.resolve(NotFoundPage));

  firstComponentLoadRunner.run(async (Root) => {
    const actual = mount(React.createElement(Root));
    const firstExpected = mount(React.createElement(FirstComponent));
    expect(actual.html()).toBe(firstExpected.html());
    await asyncFlush();
    actual.update();
    const secondExpected = mount(React.createElement(NotFoundComponent));
    expect(actual.html()).toBe(secondExpected.html());
    expect.assertions(2);
    done();
  });
});
