import * as lib from "../";

test("Get object", () => {
  expect(!!lib.createRouter()).toBeTruthy();
  expect(!!lib.createBrowserHistory()).toBeTruthy();
  expect(!!lib.createHashHistory()).toBeTruthy();
  expect(!!lib.createMemoryHistory()).toBeTruthy();
  expect(!!lib.Link).toBeTruthy();
  expect(!!lib.Request).toBeTruthy();
  expect(!!lib.URL).toBeTruthy();
});

test("Create router", () => {
  const router = lib.createRouter();
  expect(router.route).toBeInstanceOf(Function);
  expect(router.asyncRoute).toBeInstanceOf(Function);
  expect(router.run).toBeInstanceOf(Function);
  expect(router.runWitInitialProps).toBeInstanceOf(Function);
  expect(router.runWithFirstComponent).toBeInstanceOf(Function);
});
