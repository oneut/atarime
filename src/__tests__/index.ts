import * as index from "../";
import { Router } from "../lib/Router";
import { Request } from "../lib/Request";
import ServerRouter from "../ssr/ServerRouter";
import { URL } from "../lib/URL";

test("Get object", () => {
  expect(index.createRouter()).toBeInstanceOf(Router);
  expect(index.createBrowserHistory()).toBeInstanceOf(Object);
  expect(index.createHashHistory()).toBeInstanceOf(Object);
  expect(index.createMemoryHistory()).toBeInstanceOf(Object);
  expect(index.Link).toBeInstanceOf(Function);
  expect(index.Request).toBeInstanceOf(Request);
  expect(index.URL).toBeInstanceOf(URL);
  expect(index.SSR.createRouter()).toBeInstanceOf(Router);
  expect(index.SSR.createServerRouter()).toBeInstanceOf(ServerRouter);
});
