import * as React from "react";
import { RootComponent } from "../RootComponent";
import { LoadRunnerInterface } from "./LoadRunnerInterface";
import { Connector } from "../Connector";

export class FirstComponentLoadRunner implements LoadRunnerInterface {
  private readonly connector: Connector;
  private readonly firstComponent: React.ComponentType;

  constructor(connector: Connector, firstComponent: React.ComponentType) {
    this.connector = connector;
    this.firstComponent = firstComponent;
  }

  run(callback: (Root: React.FunctionComponent<{}>) => void) {
    const location = this.connector.getHistoryManager().getLocation();
    this.connector.request(location.pathname, () => {});

    this.connector.getComponentResolver().setComponent(this.firstComponent);

    callback((props) => {
      return React.createElement(RootComponent, {
        connector: this.connector,
        ...props
      });
    });
  }
}
