import * as React from "react";
import { Page, Route, Link } from "async-react-router2";
import NProgress from "nprogress";
import { sleep } from "../helper";

interface InitialProps {
  message: string;
}

export class Home extends Page<Route<{}>, InitialProps> {
  initialPropsWillGet() {
    console.log("initialPropsWillGet() called...");
    NProgress.remove();
    NProgress.start();
    NProgress.set(0.0);
    NProgress.set(0.3);
  }

  async getInitialProps() {
    console.log("getInitialProps() called...");
    await sleep(1000);
    return {
      message: "Home is one second sleep."
    };
  }

  initialPropsDidGet(initialProps: InitialProps) {
    console.log("initialPropsDidGet() called...");
    NProgress.done();
  }

  component(initialProps: InitialProps) {
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
