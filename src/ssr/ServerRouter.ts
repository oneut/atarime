import React from "react";
import { Connector } from "../lib/Connector";
import { PageClass } from "../lib/Page";
import { RouterInterface } from "../RouterInterface";

export default class ServerRouter implements RouterInterface {
  private connector: Connector;

  constructor(connector: Connector) {
    this.connector = connector;
  }

  route(path: string, pageClass: PageClass, name?: string) {
    this.connector.addRoute(path, Promise.resolve(pageClass), name);
  }

  asyncRoute(
    path: string,
    asyncPageClassFunction: () => Promise<PageClass>,
    name?: string
  ) {
    this.connector.addRoute(path, asyncPageClassFunction(), name);
  }

  resolveComponentByPathname(
    pathname: string,
    callback: (Root: React.FunctionComponent, initialProps: {}) => void
  ) {
    this.connector.resolveComponentByPathname(pathname, callback);
  }
}
