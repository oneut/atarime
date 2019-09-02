import { History, Location } from "history";

type HistoryCallbackInterface = (
  pathname: string,
  callback: () => void
) => void;

export interface HistoryManagerInterface {
  newInstance(
    history: History,
    historyCallback: HistoryCallbackInterface
  ): HistoryManagerInterface;
  changeSilent(): void;
  changeUnsilent(): void;
  listen(): void;
  listenCallback(location: Location): void;
  push(pathname: string, callback: () => void): void;
  createHref(pathname: string): History.Href;
  getLocation(): Location;
}

export class HistoryManager implements HistoryManagerInterface {
  private readonly history: History;
  private readonly historyCallback: HistoryCallbackInterface;
  private silent: boolean;

  constructor(
    history: History,
    historyCallback: HistoryCallbackInterface = (
      pathname: string,
      callback: () => void
    ) => {}
  ) {
    this.history = history;
    this.historyCallback = historyCallback;
    this.silent = false;
  }

  newInstance(history: History, historyCallback: HistoryCallbackInterface) {
    return new HistoryManager(history, historyCallback);
  }

  changeSilent() {
    this.silent = true;
  }

  changeUnsilent() {
    this.silent = false;
  }

  listen() {
    this.history.listen(this.listenCallback.bind(this));
  }

  listenCallback(location: Location) {
    if (!this.silent) this.historyCallback(location.pathname, () => {});
  }

  push(pathname: string, callback: () => void = () => {}) {
    this.changeSilent();
    this.historyCallback(pathname, callback);
    this.history.push(pathname);
    this.changeUnsilent();
  }

  createHref(pathname: string) {
    return this.history.createHref({ pathname });
  }

  getLocation() {
    return this.history.location;
  }
}
