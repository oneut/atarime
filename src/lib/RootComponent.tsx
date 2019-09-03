import * as React from "react";
import { ComponentResolver } from "./ComponentResolver";

export interface RootProps {
  componentResolver: ComponentResolver;
}

export class RootComponent<P extends RootProps> extends React.Component<
  P & React.Attributes
> {
  constructor(props: P) {
    super(props);
    props.componentResolver.subscribe(this.onStateChange.bind(this));
  }

  onStateChange() {
    this.setState({});
  }

  /**
   * Render the matching route.
   */
  render() {
    const component = this.props.componentResolver.getComponent();
    if (!component) {
      return null;
    }

    return React.createElement(component);
  }
}
