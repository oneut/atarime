import * as React from "react";
import { Page, Route, Link } from "async-react-router2";
import NProgress from "nprogress";
import { sleep } from "../helper";

interface InitialProps {
  message: string;
}

type RouteType = Route<{
  pageId: number;
}>;

export class PagePage extends Page<RouteType, InitialProps> {
  initialPropsWillGet() {
    console.log("initialPropsWillGet() called...");
    NProgress.remove();
    NProgress.start();
    NProgress.set(0.0);
    NProgress.set(0.3);
  }

  async getInitialProps() {
    console.log("getInitialProps() called...");
    await sleep(3000);
    return {
      message: `Page [${this.route.params.pageId}] is three second sleep.`
    };
  }

  initialPropsDidGet(initialProps: InitialProps) {
    console.log("initialPropsDidGet() called...");
    NProgress.done();
  }

  component(initialProps: InitialProps) {
    return (
      <div>
        <h2>Page is {this.route.params.pageId}</h2>
        <p>{initialProps.message}</p>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page">Page Index</Link>
            <ul>
              <li>
                <Link to="/page/1">Page 1</Link>
              </li>
              <li>
                <Link to="/page/2">Page 2</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}
