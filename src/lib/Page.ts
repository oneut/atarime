import * as React from "react";
import { Route, RouteType } from "./Route";

export type PageType<R = object, I = object> = Page<Route<R>, I>;
export type PageClass<R = object, I = object> = new (route: R) => Page<
  Route<R>,
  I
>;

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
