import React from "react";
import { mount } from "enzyme";
import { HistoryManager } from "../HistoryManager";
import { createMemoryHistory } from "history";
import { createLink } from "../Link";
import { Request } from "../Request";
import { Connector } from "../Connector";
import { ComponentResolver } from "../ComponentResolver";
import { RouteMatcher } from "../RouteMatcher";

test("Link", (done) => {
  (window as any).scrollTo = jest.fn(function(x: number, y: number) {
    expect(x).toBe(0);
    expect(y).toBe(0);
    done();
  });

  const historyManager = new HistoryManager(
    createMemoryHistory(),
    (pathname, callback) => {
      expect(pathname).toBe("/hello");
      callback();
    }
  );
  historyManager.listen();

  const connector = new Connector(
    historyManager,
    new RouteMatcher(),
    new ComponentResolver()
  );

  const request = new Request(connector);

  const Link = createLink(request);
  const actual = mount(<Link to="/hello">hello, world</Link>);
  expect(actual.html()).toBe('<a href="/hello">hello, world</a>');
  actual.find("a").simulate("click");
  expect.assertions(4);
});
