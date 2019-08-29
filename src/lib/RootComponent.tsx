import * as React from "react";
import { Connector } from "./Connector";

export interface RootProps {
  connector: Connector;
}

export class RootComponent<P extends RootProps> extends React.Component<
  P & React.Attributes
> {
  constructor(props: P) {
    super(props);
    props.connector.subscribe(this.onStateChange.bind(this));
  }

  onStateChange() {
    this.setState({});
  }

  /**
   * Render the matching route.
   */
  render() {
    const component = this.props.connector
      .getComponentResolver()
      .getComponent();
    if (!component) {
      return null;
    }

    return React.createElement(component);
  }
}
