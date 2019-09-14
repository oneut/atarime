import * as React from "react";
import { Page, Route, Link } from "atarime";
import NProgress from "nprogress";
import { sleep } from "../helper";

type RouteType = Route<{}>;

interface InitialPropsType {
  message: string;
}

export class PageIndexPage extends Page<RouteType, InitialPropsType> {
  public initialPropsWillGet() {
    console.log("initialPropsWillGet() called...");
    NProgress.start();
  }

  public async getInitialProps() {
    console.log("getInitialProps() called...");
    await sleep(2000);
    return {
      message: "Page Index is two second sleep."
    };
  }

  public initialPropsDidGet(initialProps: InitialPropsType) {
    console.log("initialPropsDidGet() called...");
    NProgress.done();
  }

  public component(initialProps: InitialPropsType) {
    return (
      <div>
        <h2>Page Index</h2>
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
