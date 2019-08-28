import { of } from "rxjs";
import { map, mergeMap, skipWhile, switchMap } from "rxjs/operators";
import * as React from "react";
import { RootComponent } from "../RootComponent";
import { LoadRunnerInterface } from "./LoadRunnerInterface";
import { Connector } from "../Connector";
import { Renderer } from "../Renderer";

export class LoadRunner implements LoadRunnerInterface {
  private readonly connector: Connector;

  constructor(connector: Connector) {
    this.connector = connector;
  }

  run(callback: (Root: React.FunctionComponent<{}>) => void) {
    const location = this.connector.getHistoryManager().getLocation();
    of(location.pathname)
      .pipe(
        switchMap((pathname) =>
          this.connector.getRouteMatcher().createRenderer(pathname)
        ),
        skipWhile((renderer?: Renderer) => renderer === null),
        map((renderer: Renderer) => renderer.fireInitialPropsWillGet()),
        mergeMap((renderer: Renderer) => renderer.fireGetInitialProps()),
        map((renderer: Renderer) => renderer.fireInitialPropsDidGet())
      )
      .subscribe((renderer: Renderer) => {
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
