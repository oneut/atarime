import { HistoryManager } from "../HistoryManager";
import { createMemoryHistory } from "history";

test("New Instance", () => {
  const historyCallback = (pathname: string, callback: () => void) => {};
  const historyManager = new HistoryManager(
    createMemoryHistory(),
    historyCallback
  );
  expect(
    historyManager.newInstance(createMemoryHistory(), historyCallback)
  ).toBeInstanceOf(HistoryManager);
  expect.assertions(1);
});

test("Change silent", () => {
  const mockHistoryCallbackFn = jest.fn();
  const historyCallback = (pathname: string, callback: () => void) => {
    mockHistoryCallbackFn();
  };
  const historyManager = new HistoryManager(
    createMemoryHistory(),
    historyCallback
  );

  const location = {
    pathname: "/somewhere",
    search: "?some=search-string",
    state: { fromDashboard: true },
    hash: "#howdy"
  };
  historyManager.changeSilent();
  historyManager.listenCallback(location);
  expect(mockHistoryCallbackFn).not.toHaveBeenCalled();
  expect.assertions(1);
});

test("Change unsilent", () => {
  const mockHistoryCallbackFn = jest.fn();
  const historyCallback = (pathname: string, callback: () => void) => {
    mockHistoryCallbackFn();
  };
  const historyManager = new HistoryManager(
    createMemoryHistory(),
    historyCallback
  );

  const location = {
    pathname: "/somewhere",
    search: "?some=search-string",
    state: { fromDashboard: true },
    hash: "#howdy"
  };
  historyManager.changeUnsilent();
  historyManager.listenCallback(location);
  expect(mockHistoryCallbackFn).toHaveBeenCalled();
  expect.assertions(1);
});

test("Push & Listen callback", () => {
  const historyCallback = (pathname: string, callback: () => void) => {
    callback();
  };
  const historyManager = new HistoryManager(
    createMemoryHistory(),
    historyCallback
  );

  const mockPushCallbackFn = jest.fn();
  const pushCallback = () => {
    mockPushCallbackFn();
  };

  historyManager.push("/", pushCallback);
  expect(mockPushCallbackFn).toHaveBeenCalled();
  expect.assertions(1);
});

test("Push & Listen default callback", () => {
  const historyManager = new HistoryManager(createMemoryHistory());

  const mockPushCallbackFn = jest.fn();
  const pushCallback = () => {
    mockPushCallbackFn();
  };

  historyManager.push("/", pushCallback);
  expect(mockPushCallbackFn).not.toHaveBeenCalled();
  expect.assertions(1);
});

test("Listen", () => {
  const mockHistoryCallbackFn = jest.fn();
  const historyCallback = (pathname: string, callback: () => void) => {
    mockHistoryCallbackFn();
  };

  const memoryHistory = createMemoryHistory();
  const historyManager = new HistoryManager(memoryHistory, historyCallback);
  historyManager.listen();

  memoryHistory.push("/");
  expect(mockHistoryCallbackFn).toHaveBeenCalled();
  expect.assertions(1);
});

test("Create href", () => {
  const historyManager = new HistoryManager(
    createMemoryHistory(),
    (pathname: string, callback: () => void) => {}
  );

  expect(historyManager.createHref("/test")).toBe("/test");
  expect.assertions(1);
});

test("Get location", () => {
  const historyManager = new HistoryManager(
    createMemoryHistory(),
    (pathname: string, callback: () => void) => {}
  );

  historyManager.push("/test");
  expect(historyManager.getLocation().pathname).toBe("/test");
  expect.assertions(1);
});
