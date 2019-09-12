import { Page, Route } from "async-react-router2";
import NProgress from "nprogress";
import * as React from "react";
import { App } from "../layout/App";
import { NotFound } from "../layout/error/NotFound";

type RouteType = Route<{}>;

export default class NotFoundPage extends Page<RouteType, {}> {
  static initialPropsWillGet() {
    NProgress.start();
  }

  static initialPropsDidGet() {
    NProgress.done();
  }

  component() {
    return (
      <App>
        <NotFound />
      </App>
    );
  }
}
