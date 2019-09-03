import ServerRouter from "./ServerRouter";
import { Router } from "../lib/Router";
import { connector } from "../lib/Facade";
import { createBrowserHistory, createMemoryHistory } from "history";

function createRouter() {
  // Settings HistoryManager.
  return new Router(connector.newInitializedInstance(createBrowserHistory()));
}

function createServerRouter() {
  // Must define history. Because history is used in Request, URL, etc..
  return new ServerRouter(
    connector.newInitializedInstance(createMemoryHistory())
  );
}

export { createRouter, createServerRouter };
