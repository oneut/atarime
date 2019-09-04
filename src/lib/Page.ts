import * as React from "react";
import { Route, RouteType } from "./Route";

export type PageType<R = {}, I = {}> = Page<Route<R>, I>;

export type PageClass<R = {}, I = {}> = new (route: R) => PageType<R, I>;

export interface PageInterface<InitialProps> {
  initialPropsWillGet(): void;
  getInitialProps(): void;
  initialPropsDidGet(initialProps: InitialProps): void;
  component(initialProps: InitialProps): React.ReactElement;
}

export abstract class Page<R extends RouteType, InitialProps extends {}>
  implements PageInterface<InitialProps> {
  protected route: R;

  constructor(route: R) {
    this.route = route;
  }

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
