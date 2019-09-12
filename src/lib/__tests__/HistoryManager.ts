import { createHashHistory, createMemoryHistory } from "history";
import { HistoryManager } from "../HistoryManager";

test("New Instance", () => {
  const historyManager = new HistoryManager(createMemoryHistory());

  expect(historyManager.newInstance(createMemoryHistory())).toBeInstanceOf(
    HistoryManager
  );
  expect.assertions(1);
});

test("Set history", () => {
  const historyManager = new HistoryManager(createMemoryHistory());
  expect(historyManager.setHistory(createHashHistory())).toBeInstanceOf(
    HistoryManager
  );
  expect.assertions(1);
});

test("Set history callback", () => {
  // ref. "Push & Listen callback"
});

test("Change silent", () => {
  const checkCallback = jest.fn();
  const historyManager = new HistoryManager(createMemoryHistory());
  historyManager.setHistoryCallback(
    (pathname: string, callback: () => void) => {
      checkCallback();
      callback();
    }
  );

  const location = {
    pathname: "/somewhere",
    search: "?some=search-string",
    state: { fromDashboard: true },
    hash: "#howdy"
  };
  historyManager.changeSilent();
  historyManager.listenCallback(location);
  expect(checkCallback).not.toHaveBeenCalled();
  expect.assertions(1);
});

test("Change unsilent", () => {
  const checkCallback = jest.fn();
  const historyManager = new HistoryManager(createMemoryHistory());

  historyManager.setHistoryCallback(
    (pathname: string, callback: () => void) => {
      checkCallback();
      callback();
    }
  );

  const location = {
    pathname: "/somewhere",
    search: "?some=search-string",
    state: { fromDashboard: true },
    hash: "#howdy"
  };
  historyManager.changeUnsilent();
  historyManager.listenCallback(location);
  expect(checkCallback).toHaveBeenCalled();
  expect.assertions(1);
});

test("Push & Listen callback", () => {
  const historyManager = new HistoryManager(createMemoryHistory());

  historyManager.setHistoryCallback(
    (pathname: string, callback: () => void) => {
      callback();
    }
  );

  const checkCallback = jest.fn();
  const pushCallback = () => {
    checkCallback();
  };

  historyManager.push("/", pushCallback);
  expect(checkCallback).toHaveBeenCalled();
  expect.assertions(1);
});

test("Listen", () => {
  const mockHistoryCallbackFn = jest.fn();
  const memoryHistory = createMemoryHistory();
  const historyManager = new HistoryManager(memoryHistory);
  historyManager
    .setHistoryCallback((pathname: string, callback: () => void) => {
      mockHistoryCallbackFn();
      callback();
    })
    .listen();

  memoryHistory.push("/");
  expect(mockHistoryCallbackFn).toHaveBeenCalled();
  expect.assertions(1);
});

test("Create href", () => {
  const historyManager = new HistoryManager(createMemoryHistory());

  expect(historyManager.createHref("/test")).toBe("/test");
  expect.assertions(1);
});

test("Get location", () => {
  const historyManager = new HistoryManager(createMemoryHistory());

  historyManager.push("/test");
  expect(historyManager.getLocation().pathname).toBe("/test");
  expect.assertions(1);
});
