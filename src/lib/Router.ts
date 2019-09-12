import * as React from "react";
import { RouterInterface } from "../RouterInterface";
import { Connector } from "./Connector";
import { PageClass } from "./Page";
import { DynamicImport } from "./DynamicImport";

export class Router implements RouterInterface {
  private readonly connector: Connector;

  constructor(connector: Connector) {
    this.connector = connector;
  }

  route(path: string, pageClass: PageClass, name?: string) {
    this.connector.addRoute(path, Promise.resolve(pageClass), name);
  }

  asyncRoute(
    path: string,
    asyncPageClassFunction: () => Promise<PageClass | DynamicImport<PageClass>>,
    name?: string
  ) {
    this.connector.addRoute(path, asyncPageClassFunction(), name);
  }

  run(callback: (Root: React.FunctionComponent<{}>) => void) {
    this.connector.run(callback);
  }

  runWithInitialProps(
    initialProps: {},
    callback: (Root: React.FunctionComponent<{}>) => void
  ) {
    this.connector.runWithInitialProps(initialProps, callback);
  }

  runWithFirstComponent(
    firstComponent: React.ComponentType,
    callback: (Root: React.FunctionComponent<{}>) => void
  ) {
    this.connector.runWithFirstComponent(firstComponent, callback);
  }
}
