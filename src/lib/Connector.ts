import { History } from "history";
import * as React from "react";
import { ComponentResolver } from "./ComponentResolver";
import { HistoryManager } from "./HistoryManager";
import { RouteMatcher } from "./RouteMatcher";
import { Renderer } from "./Renderer";
import { RootComponent } from "./RootComponent";
import { PageClass } from "./Page";
import { DynamicImport } from "./DynamicImport";
import { LatestPromiseResolver } from "./LatestPromiseResolver";

export class Connector {
  private readonly latestPromiseResolver: LatestPromiseResolver<Renderer | null>;
  private historyManager: HistoryManager;
  private routeMatcher: RouteMatcher;
  private componentResolver: ComponentResolver;

  constructor(
    historyManager: HistoryManager,
    routeMatcher: RouteMatcher,
    componentResolver: ComponentResolver
  ) {
    this.latestPromiseResolver = this.createLatestPromiseResolver();
    this.historyManager = historyManager;
    this.routeMatcher = routeMatcher;
    this.componentResolver = componentResolver;
  }

  initialize(history: History) {
    this.historyManager = this.historyManager.newInstance(history);
    this.historyManager
      .setHistoryCallback(this.nextRequest.bind(this))
      .listen();
    this.routeMatcher = this.routeMatcher.newInstance();
    this.componentResolver = this.componentResolver.newInstance();
    return this;
  }

  addRoute(
    path: string,
    promisePageClass: Promise<PageClass | DynamicImport<PageClass>>,
    name?: string
  ) {
    this.routeMatcher.addRoute(path, promisePageClass, name);
  }

  nextRequest(pathname: string, callback: () => void = () => {}) {
    this.latestPromiseResolver.next(
      (async () => {
        const renderer = await this.routeMatcher.createRenderer(
          pathname,
          callback
        );
        if (renderer === null) {
          // @todo NotFound.
          return null;
        }

        renderer.fireInitialPropsWillGet();
        await renderer.fireGetInitialProps();
        return renderer;
      })()
    );
  }

  pushHistory(to: string, callback: () => void) {
    this.historyManager.push(to, callback);
  }

  pushHistoryByName(name: string, parameters: {}, callback: () => void) {
    const pathname = this.routeMatcher.compileByName(name, parameters);
    this.historyManager.push(pathname, callback);
  }

  isCurrentPathname(pathname: string) {
    const location = this.historyManager.getLocation();
    return location.pathname === pathname;
  }

  createHref(pathname: string) {
    return this.historyManager.createHref(pathname);
  }

  createHrefByName(name: string, parameters: { [key: string]: any }) {
    const pathname = this.routeMatcher.compileByName(name, parameters);
    return this.historyManager.createHref(pathname);
  }

  run(callback: (Root: React.FunctionComponent<{}>) => void) {
    (async () => {
      const location = this.historyManager.getLocation();
      const renderer = await this.routeMatcher.createRenderer(
        location.pathname
      );
      if (renderer == null) {
        // @todo NotFound.
        return;
      }
      renderer.fireInitialPropsWillGet();
      await renderer.fireGetInitialProps();
      renderer.fireInitialPropsDidGet();
      this.componentResolver.setComponentFromRenderer(renderer);
      callback(() => {
        return React.createElement(RootComponent, {
          componentResolver: this.componentResolver
        });
      });
    })();
  }

  runWithInitialProps(
    initialProps: {},
    callback: (Root: React.FunctionComponent<{}>) => void
  ) {
    (async () => {
      const location = this.historyManager.getLocation();
      const renderer = await this.routeMatcher.createRenderer(
        location.pathname
      );
      if (renderer == null) {
        // @todo NotFound.
        return;
      }
      renderer.setInitialProps(initialProps);
      this.componentResolver.setComponentFromRenderer(renderer);
      callback(() => {
        return React.createElement(RootComponent, {
          componentResolver: this.componentResolver
        });
      });
    })();
  }

  async runWithFirstComponent(
    firstComponent: React.ComponentType,
    callback: (Root: React.FunctionComponent<{}>) => void
  ) {
    const location = this.historyManager.getLocation();
    this.nextRequest(location.pathname);
    this.componentResolver.setComponent(firstComponent);
    callback(() => {
      return React.createElement(RootComponent, {
        componentResolver: this.componentResolver
      });
    });
  }

  resolveComponentByPathname(
    pathname: string,
    callback: (Root: React.FunctionComponent, initialProps: {}) => void
  ) {
    (async () => {
      const renderer = await this.routeMatcher.createRenderer(pathname);
      if (renderer == null) {
        // @todo NotFound.
        return;
      }
      await renderer.fireGetInitialProps();
      const component = renderer.getComponent();
      callback(() => {
        return React.createElement(component);
      }, renderer.getComponentProps());
    })();
  }

  private createLatestPromiseResolver() {
    const latestPromiseResolver = new LatestPromiseResolver<Renderer>();
    latestPromiseResolver.subscribe(async (renderer: Renderer | null) => {
      if (renderer === null) {
        // @todo NotFound.
        return;
      }
      renderer.fireInitialPropsDidGet();
      renderer.fireRequestCallback();
      this.componentResolver.setComponentFromRenderer(renderer).changeState();
    });

    return latestPromiseResolver;
  }
}
