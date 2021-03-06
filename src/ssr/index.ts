import { createBrowserHistory, createMemoryHistory } from "history";
import { Router } from "../lib/Router";
import { connector } from "../lib/Facade";
import ServerRouter from "./ServerRouter";

function createRouter() {
  // Settings HistoryManager.
  return new Router(connector.initialize(createBrowserHistory()));
}

function createServerRouter() {
  // Must define history. Because history is used in Request, URL, etc..
  return new ServerRouter(connector.initialize(createMemoryHistory()));
}

export { createRouter, createServerRouter };
