import * as React from "react";
import { Renderer } from "./Renderer";

export class ComponentResolver {
  private component?: React.ComponentType;
  private onStateChange: () => void;

  constructor() {
    this.component = undefined;
    this.onStateChange = () => {};
  }

  newInstance() {
    return new ComponentResolver();
  }

  setComponentFromRenderer(renderer: Renderer) {
    this.setComponent(renderer.getComponent());
    return this;
  }

  setComponent(component: React.ComponentType) {
    this.component = component;
    return this;
  }

  getComponent() {
    return this.component;
  }

  changeState() {
    this.onStateChange();
    return this;
  }

  subscribe(onStateChange: () => void) {
    this.onStateChange = onStateChange;
  }
}
