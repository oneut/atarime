import * as React from "react";
import {Renderer} from "./Renderer";

export class ComponentResolver {
    private component?: React.ComponentType;

    constructor() {
        this.component = undefined;
    }

    setComponentFromRenderer(renderer: Renderer) {
        this.setComponentFromElement(renderer.getComponent());
    }

    setComponentFromElement(reactElement: React.ReactElement) {
        this.setComponent(() => {
            return reactElement;
        });
    }

    setComponent(component: React.ComponentType) {
        this.component = component;
    }

    getComponent() {
        return this.component;
    }
}
