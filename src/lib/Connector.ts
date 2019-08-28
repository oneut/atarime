import { Subject } from "rxjs";
import { map, mergeMap, skipWhile, switchMap } from "rxjs/operators";
import { ComponentResolver } from "./ComponentResolver";
import { HistoryManagerInterface } from "./HistoryManager";
import { RouteMatcher } from "./RouteMatcher";
import { Renderer } from "./Renderer";
import { History } from "history";

interface RequestType {
  pathname: string;
  callback: () => void;
}

export class Connector {
  private readonly stream: Subject<RequestType>;
  private readonly historyManager: HistoryManagerInterface;
  private readonly routeMatcher: RouteMatcher;
  private readonly componentResolver: ComponentResolver;
  private onStateChange: () => void;

  constructor(
    historyManager: HistoryManagerInterface,
    routeMatcher: RouteMatcher,
    componentResolver: ComponentResolver
  ) {
    this.stream = this.createStream();
    this.historyManager = historyManager;
    this.routeMatcher = routeMatcher;
    this.componentResolver = componentResolver;
    this.onStateChange = () => {};
  }

  getHistoryManager() {
    return this.historyManager;
  }

  getRouteMatcher() {
    return this.routeMatcher;
  }

  getComponentResolver() {
    return this.componentResolver;
  }

  newInitializedInstance(history: History) {
    const connector = new Connector(
      this.historyManager.newInstance(history, this.request.bind(this)),
      this.routeMatcher.newInstance(),
      new ComponentResolver()
    );
    this.historyManager.listen();
    return connector;
  }

  createStream() {
    const stream = new Subject<RequestType>();
    stream
      .pipe(
        switchMap((request) =>
          this.routeMatcher.createRenderer(request.pathname, request.callback)
        ),
        skipWhile((renderer?: Renderer) => renderer === null),
        map((renderer: Renderer) => renderer.fireInitialPropsWillGet()),
        mergeMap((renderer: Renderer) => renderer.fireGetInitialProps()),
        map((renderer: Renderer) =>
          renderer.fireInitialPropsDidGet().fireRequestCallback()
        )
      )
      .subscribe((renderer: Renderer) => {
        this.componentResolver.setComponentFromRenderer(renderer);
        this.onStateChange();
      });

    return stream;
  }

  subscribe(onStateChange: () => void) {
    this.onStateChange = onStateChange;
  }

  request(pathname: string, callback: () => void = () => {}) {
    this.stream.next({
      pathname: pathname,
      callback: callback
    });
  }
}
