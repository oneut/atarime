import * as SSR from "../";
import { Router } from "../../lib/Router";
import ServerRouter from "../ServerRouter";

test("Get object", () => {
  expect(SSR.createRouter()).toBeInstanceOf(Router);
  expect(SSR.createServerRouter()).toBeInstanceOf(ServerRouter);
});
