import * as React from "react";
import { Page, Route, Link } from "atarime";
import NProgress from "nprogress";
import { sleep } from "../helper";

type RouteType = Route<{}>;

interface InitialPropsType {
  message: string;
}

export class Home extends Page<RouteType, InitialPropsType> {
  public initialPropsWillGet() {
    console.log("initialPropsWillGet() called...");
    NProgress.start();
  }

  public async getInitialProps() {
    console.log("getInitialProps() called...");
    await sleep(1000);
    return {
      message: "Home is one second sleep."
    };
  }

  public initialPropsDidGet(initialProps: InitialPropsType) {
    console.log("initialPropsDidGet() called...");
    NProgress.done();
  }

  public component(initialProps: InitialPropsType) {
    return (
      <div>
        <h2>Home</h2>
        <p>This sample uses async / await to control sleep.</p>
        <p>{initialProps.message}</p>
        <ul>
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
