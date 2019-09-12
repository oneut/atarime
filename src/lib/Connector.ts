import { of, Subject } from "rxjs";
import { map, mergeMap, skipWhile, switchMap } from "rxjs/operators";
import { History } from "history";
import * as React from "react";
import { ComponentResolver } from "./ComponentResolver";
import { HistoryManager } from "./HistoryManager";
import { RouteMatcher } from "./RouteMatcher";
import { Renderer } from "./Renderer";
import { RootComponent } from "./RootComponent";
import { PageClass } from "./Page";
import { DynamicImport } from "./DynamicImport";

interface RequestType {
  pathname: string;
  callback: () => void;
}

export class Connector {
  private readonly stream: Subject<RequestType>;
  private readonly historyManager: HistoryManager;
  private readonly routeMatcher: RouteMatcher;
  private readonly componentResolver: ComponentResolver;

  constructor(
    historyManager: HistoryManager,
    routeMatcher: RouteMatcher,
    componentResolver: ComponentResolver
  ) {
    this.stream = this.createStream();
    this.historyManager = historyManager;
    this.routeMatcher = routeMatcher;
    this.componentResolver = componentResolver;
  }

  initialize(history: History) {
    this.historyManager
      .setHistory(history)
      .setHistoryCallback(this.nextRequest.bind(this))
      .listen();
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
    this.stream.next({
      pathname: pathname,
      callback: callback
    });
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
    const location = this.historyManager.getLocation();
    of(location.pathname)
      .pipe(
        switchMap((pathname) => this.routeMatcher.createRenderer(pathname)),
        skipWhile((renderer?: Renderer) => renderer === null),
        map((renderer: Renderer) => renderer.fireInitialPropsWillGet()),
        mergeMap((renderer: Renderer) => renderer.fireGetInitialProps()),
        map((renderer: Renderer) => renderer.fireInitialPropsDidGet())
      )
      .subscribe((renderer: Renderer) => {
        this.componentResolver.setComponentFromRenderer(renderer);
        callback(() => {
          return React.createElement(RootComponent, {
            componentResolver: this.componentResolver
          });
        });
      });
  }

  runWithInitialProps(
    initialProps: {},
    callback: (Root: React.FunctionComponent<{}>) => void
  ) {
    const location = this.historyManager.getLocation();

    of(location.pathname)
      .pipe(
        switchMap((pathname) => this.routeMatcher.createRenderer(pathname)),
        skipWhile((renderer?: Renderer) => renderer === null),
        map((renderer: Renderer) => renderer.setInitialProps(initialProps))
      )
      .subscribe((renderer) => {
        this.componentResolver.setComponentFromRenderer(renderer);
        callback(() => {
          return React.createElement(RootComponent, {
            componentResolver: this.componentResolver
          });
        });
      });
  }

  runWithFirstComponent(
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
    of(pathname)
      .pipe(
        switchMap((pathname) => this.routeMatcher.createRenderer(pathname)),
        skipWhile((renderer?: Renderer) => renderer === null),
        mergeMap((renderer: Renderer) => renderer.fireGetInitialProps())
      )
      .subscribe((renderer) => {
        const component = renderer.getComponent();
        callback(() => {
          return React.createElement(component);
        }, renderer.getComponentProps());
      });
  }

  private createStream() {
    const stream = new Subject<RequestType>();
    stream
      .pipe(
        switchMap((request) =>
          this.routeMatcher.createRenderer(request.pathname, request.callback)
        ),
        skipWhile((renderer?: Renderer) => renderer === null),
        map((renderer: Renderer) => renderer.fireInitialPropsWillGet()),
        switchMap((renderer: Renderer) => renderer.fireGetInitialProps()),
        map((renderer: Renderer) =>
          renderer.fireInitialPropsDidGet().fireRequestCallback()
        )
      )
      .subscribe((renderer: Renderer) => {
        this.componentResolver.setComponentFromRenderer(renderer).changeState();
      });

    return stream;
  }
}
