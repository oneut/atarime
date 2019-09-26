import { Connector } from "./Connector";

export class Request {
  private readonly connector: Connector;

  constructor(connector: Connector) {
    this.connector = connector;
  }

  to(to: string, callback: () => void = () => {}) {
    this.connector.pushHistory(this.normalizeTo(to), callback);
  }

  name(name: string, parameters: {} = {}, callback: () => void = () => {}) {
    this.connector.pushHistoryByName(name, parameters, callback);
  }

  isActive(pathname: string) {
    return this.connector.isCurrentPathname(pathname);
  }

  normalizeTo(to: string) {
    if (to[0] === "#") {
      return to.substr(1);
    }

    return to;
  }
}
