import { InitialPropsRunner } from "./runner/InitialPropsRunner";
import { FirstComponentLoadRunner } from "./runner/FirstComponentLoadRunner";
import { LoadRunner } from "./runner/LoadRunner";
import { Connector } from "./Connector";
import * as React from "react";
import { PageClass } from "./Page";

export class Router {
  private readonly connector: Connector;

  constructor(connector: Connector) {
    this.connector = connector;
  }

  route(path: string, routeClass: PageClass, name?: string) {
    this.connector
      .getRouteMatcher()
      .addRoute(path, Promise.resolve(routeClass), name);
  }

  asyncRoute(
    path: string,
    asyncPageFunction: () => Promise<PageClass>,
    name?: string
  ) {
    this.connector.getRouteMatcher().addRoute(path, asyncPageFunction(), name);
  }

  // @todo
  run(callback: (Root: React.FunctionComponent<{}>) => void) {
    const runner = new LoadRunner(this.connector);
    runner.run(callback);
  }

  runWitInitialProps(
    initialProps: any,
    callback: (Root: React.FunctionComponent<{}>) => void
  ) {
    const runner = new InitialPropsRunner(this.connector, initialProps);
    runner.run(callback);
  }

  runWithFirstComponent(
    firstComponent: React.ComponentType,
    callback: (Root: React.FunctionComponent<{}>) => void
  ) {
    const runner = new FirstComponentLoadRunner(this.connector, firstComponent);
    runner.run(callback);
  }
}
