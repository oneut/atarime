import { of } from "rxjs";
import { map, skipWhile, switchMap } from "rxjs/operators";
import * as React from "react";
import { RootComponent, RootProps } from "../RootComponent";
import { LoadRunnerInterface } from "./LoadRunnerInterface";
import { Connector } from "../Connector";
import { Renderer } from "../Renderer";

export class InitialPropsRunner implements LoadRunnerInterface {
  private readonly connector: Connector;
  private initialProps: {};

  constructor(connector: Connector, initialProps: {}) {
    this.connector = connector;
    this.initialProps = initialProps;
  }

  run(callback: (Root: React.FunctionComponent<RootProps>) => void) {
    const location = this.connector.getHistoryManager().getLocation();

    of(location.pathname)
      .pipe(
        switchMap((pathname) =>
          this.connector.getRouteMatcher().createRenderer(pathname)
        ),
        skipWhile((renderer?: Renderer) => renderer === null),
        map((renderer: Renderer) => renderer.setInitialProps(this.initialProps))
      )
      .subscribe((renderer) => {
        this.connector
          .getComponentResolver()
          .setComponentFromRenderer(renderer);
        callback((props) => {
          return React.createElement(RootComponent, {
            connector: this.connector,
            ...props
          });
        });
      });
  }
}
