import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory
} from "history";
import { Link, Request, URL, connector } from "./lib/Facade";
import { Page } from "./lib/Page";
import { Route } from "./lib/Route";
import { Router } from "./lib/Router";
import * as SSR from "./ssr";
import { RouterInterface } from "./RouterInterface";

function createRouter(history = createHashHistory()) {
  return new Router(connector.initialize(history));
}

export {
  RouterInterface,
  createRouter,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  Page,
  Route,
  Link,
  Request,
  URL,
  SSR
};
