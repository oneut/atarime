import { createMemoryHistory } from "history";
import { Connector } from "../Connector";
import { Request } from "../Request";
import { HistoryManager } from "../HistoryManager";
import { RouteMatcher } from "../RouteMatcher";
import { ComponentResolver } from "../ComponentResolver";

test("To", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  jest
    .spyOn(connector, "pushHistory")
    .mockImplementation((to: string, callback: () => void) => {
      expect(to).toBe("/test");
      callback();
    });

  const request = new Request(connector);
  request.to("/test");
  expect.assertions(1);
});

test("To with callback", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  jest
    .spyOn(connector, "pushHistory")
    .mockImplementation((to: string, callback: () => void) => {
      expect(to).toBe("/test");
      callback();
    });

  const request = new Request(connector);
  const checkCallback = jest.fn();
  request.to("/test", () => {
    checkCallback();
  });
  expect(checkCallback).toHaveBeenCalled();
  expect.assertions(2);
});

test("Name", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  jest
    .spyOn(connector, "pushHistoryByName")
    .mockImplementation(
      (name: string, parameters: {}, callback: () => void) => {
        expect(name).toBe("Index");
        expect(parameters).toStrictEqual({});
        callback();
      }
    );

  const request = new Request(connector);
  request.name("Index");
  expect.assertions(2);
});

test("Name with parameters", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  jest
    .spyOn(connector, "pushHistoryByName")
    .mockImplementation(
      (name: string, parameters: {}, callback: () => void) => {
        expect(name).toBe("Index");
        expect(parameters).toStrictEqual({});
        callback();
      }
    );

  const request = new Request(connector);
  request.name("Index");
  expect.assertions(2);
});

test("Name with callback", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  jest
    .spyOn(connector, "pushHistoryByName")
    .mockImplementation(
      (name: string, parameters: {}, callback: () => void) => {
        expect(name).toBe("Index");
        expect(parameters).toStrictEqual({});
        callback();
      }
    );

  const request = new Request(connector);
  const checkCallback = jest.fn();
  request.name("Index", {}, () => {
    checkCallback();
  });
  expect(checkCallback).toHaveBeenCalled();
  expect.assertions(3);
});

test("isActive", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  jest
    .spyOn(connector, "isCurrentPathname")
    .mockImplementation((pathname: string) => {
      expect(pathname).toBe("/test");
      return true;
    });

  const request = new Request(connector);
  expect(request.isActive("/test")).toBeTruthy();
  expect.assertions(2);
});

test("Request path normalized", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  const request = new Request(connector);
  expect(request.normalizeTo("#/test")).toBe("/test");
  expect(request.normalizeTo("/test")).toBe("/test");
  expect(request.normalizeTo("/test/1")).toBe("/test/1");
});
