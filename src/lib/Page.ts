import * as React from "react";
import { Route, RouteType } from "./Route";

export type PageType<R = any, I = any> = Page<Route<R>, I>;

export type PageClass<R = any, I = any> = new (route: R) => Page<Route<R>, I>;

export abstract class Page<R extends RouteType, InitialProps extends {}> {
  constructor(public route: R) {}

  public initialPropsWillGet() {
    // do nothing.
  }

  async getInitialProps(): Promise<InitialProps | {}> {
    return {};
  }

  public initialPropsDidGet(initialProps: InitialProps) {
    // do nothing.
  }

  abstract component(initialProps: InitialProps): React.ReactElement;
}
