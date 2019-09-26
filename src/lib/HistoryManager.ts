import { History, Location } from "history";

type HistoryCallbackInterface = (
  pathname: string,
  callback: () => void
) => void;

export class HistoryManager {
  private history: History;
  private historyCallback: HistoryCallbackInterface;
  private silent: boolean;

  constructor(history: History) {
    this.history = history;
    this.historyCallback = (pathname: string, callback: () => void) => {};
    this.silent = false;
  }

  newInstance(history: History) {
    return new HistoryManager(history);
  }

  setHistory(history: History) {
    this.history = history;
    return this;
  }

  setHistoryCallback(historyCallback: HistoryCallbackInterface) {
    this.historyCallback = historyCallback;
    return this;
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
