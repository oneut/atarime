import { Connector } from "../Connector";
import { Request } from "../Request";
import { HistoryManager } from "../HistoryManager";
import { RouteMatcher } from "../RouteMatcher";
import { ComponentResolver } from "../ComponentResolver";
import { Page, Route } from "../Page";
import * as React from "react";

jest.mock("../HistoryManager");

const MockedHistoryManager = HistoryManager as jest.Mock<HistoryManager>;

beforeEach(() => {
  MockedHistoryManager.mockClear();
});

test("to", () => {
  MockedHistoryManager.mockImplementation((): any => {
    return {
      push: (pathname: string) => {
        expect(pathname).toBe("/test");
      }
    };
  });

  const connector = new Connector(
    new MockedHistoryManager(),
    new RouteMatcher(),
    new ComponentResolver()
  );

  // Request test
  const request = new Request(connector);
  request.to("/test");
  expect.assertions(1);
});

test("to with callback", () => {
  MockedHistoryManager.mockImplementation((): any => {
    return {
      push: (pathname: string, callback: () => void) => {
        expect(pathname).toBe("/test");
        callback();
      }
    };
  });

  const connector = new Connector(
    new MockedHistoryManager(),
    new RouteMatcher(),
    new ComponentResolver()
  );

  // Request test
  const request = new Request(connector);
  const mockRequestCallback = jest.fn();
  request.to("/test", () => {
    mockRequestCallback();
  });
  expect(mockRequestCallback).toHaveBeenCalled();
  expect.assertions(2);
});

test("name", () => {
  MockedHistoryManager.mockImplementation((): any => {
    return {
      push: (pathname: string) => {
        expect(pathname).toBe("/");
      }
    };
  });

  const connector = new Connector(
    new MockedHistoryManager(),
    new RouteMatcher(),
    new ComponentResolver()
  );

  class IndexPage extends Page<Route<{}>, {}> {
    component(initialProps: {}) {
      return <div>Hello, World.</div>;
    }
  }

  connector
    .getRouteMatcher()
    .addRoute("/", Promise.resolve(IndexPage), "Index");

  // Request test
  const request = new Request(connector);
  request.name("Index");
  expect.assertions(1);
});

test("isActive", (done) => {
  MockedHistoryManager.mockImplementation((): any => {
    return {
      getLocation: () => {
        return {
          pathname: "/test"
        };
      }
    };
  });

  const connector = new Connector(
    new MockedHistoryManager(),
    new RouteMatcher(),
    new ComponentResolver()
  );

  // Request test
  const request = new Request(connector);
  expect(request.isActive("/test")).toBeTruthy();
  expect(request.isActive("/")).toBeFalsy();
  done();
});

test("Request path normalized", () => {
  const connector = new Connector(
    new MockedHistoryManager(),
    new RouteMatcher(),
    new ComponentResolver()
  );

  // Request test
  const request = new Request(connector);
  expect(request.normalizeTo("#/test")).toBe("/test");
  expect(request.normalizeTo("/test")).toBe("/test");
  expect(request.normalizeTo("/test/1")).toBe("/test/1");
});
