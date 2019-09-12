import { createMemoryHistory } from "history";
import { Connector } from "../Connector";
import { URL } from "../URL";
import { RouteMatcher } from "../RouteMatcher";
import { ComponentResolver } from "../ComponentResolver";
import { HistoryManager } from "../HistoryManager";

test("To", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  jest
    .spyOn(connector, "createHref")
    .mockImplementation((pathname: string): string => {
      expect(pathname).toBe("/test");
      return "";
    });

  const url = new URL(connector);

  url.to("/test");
  expect.assertions(1);
});

test("Name", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  jest
    .spyOn(connector, "createHrefByName")
    .mockImplementation(
      (name: string, parameters: { [key: string]: any } = {}): string => {
        expect(name).toBe("Test");
        expect(parameters).toStrictEqual({});
        return "";
      }
    );

  const url = new URL(connector);
  url.name("Test");
  expect.assertions(2);
});

test("Name with parameters", () => {
  const connector = new Connector(
    new HistoryManager(createMemoryHistory()),
    new RouteMatcher(),
    new ComponentResolver()
  );

  jest
    .spyOn(connector, "createHrefByName")
    .mockImplementation(
      (name: string, parameters: { [key: string]: any } = {}): string => {
        expect(name).toBe("Test");
        expect(parameters).toStrictEqual({ id: 1 });
        return "";
      }
    );

  const url = new URL(connector);
  url.name("Test", { id: 1 });
  expect.assertions(2);
});
