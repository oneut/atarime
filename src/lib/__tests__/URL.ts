import { Connector } from "../Connector";
import { URL } from "../URL";
import { RouteMatcher } from "../RouteMatcher";
import { ComponentResolver } from "../ComponentResolver";
import { HistoryManager } from "../HistoryManager";

jest.mock("../HistoryManager");
jest.mock("../RouteMatcher");

const MockedHistoryManager = HistoryManager as jest.Mock<HistoryManager>;
const MockedRouteMatcher = RouteMatcher as jest.Mock<RouteMatcher>;

beforeEach(() => {
  MockedHistoryManager.mockClear();
  MockedRouteMatcher.mockClear();
});

test("To", () => {
  expect.assertions(1);

  MockedHistoryManager.mockImplementation((): any => {
    return {
      createHref: (pathname: string): string => {
        expect(pathname).toBe("/test");
        return pathname;
      }
    };
  });

  const connector = new Connector(
    new MockedHistoryManager(),
    new RouteMatcher(),
    new ComponentResolver()
  );
  const url = new URL(connector);
  url.to("/test");
});

test("Name", () => {
  expect.assertions(2);

  MockedHistoryManager.mockImplementation((): any => {
    return {
      createHref: (pathname: string): string => {
        expect(pathname).toBe("/test");
        return pathname;
      }
    };
  });

  MockedRouteMatcher.mockImplementation((): any => {
    return {
      compileByName: (name: string): string => {
        expect(name).toBe("test");
        return "/" + name;
      }
    };
  });

  const connector = new Connector(
    new MockedHistoryManager(),
    new MockedRouteMatcher(),
    new ComponentResolver()
  );

  const url = new URL(connector);
  url.name("test");
});

test("Name with parameters", () => {
  expect.assertions(3);

  MockedHistoryManager.mockImplementation((): any => {
    return {
      createHref: (pathname: string): string => {
        expect(pathname).toBe("/test");
        return pathname;
      }
    };
  });

  MockedRouteMatcher.mockImplementation((): any => {
    return {
      compileByName: (
        name: string,
        parameters: { [key: string]: any }
      ): string => {
        expect(name).toBe("test");
        expect(parameters.test).toBe(1);
        return "/" + name;
      }
    };
  });

  const connector = new Connector(
    new MockedHistoryManager(),
    new MockedRouteMatcher(),
    new ComponentResolver()
  );
  const url = new URL(connector);
  url.name("test", { test: 1 });
});
