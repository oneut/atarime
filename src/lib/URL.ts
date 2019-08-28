import { Connector } from "./Connector";

export class URL {
  private readonly connector: Connector;

  constructor(connector: Connector) {
    this.connector = connector;
  }

  to(pathname: string) {
    return this.connector.getHistoryManager().createHref(pathname);
  }

  name(name: string, parameters: { [key: string]: any } = {}) {
    const pathname = this.connector
      .getRouteMatcher()
      .compileByName(name, parameters);
    return this.connector.getHistoryManager().createHref(pathname);
  }
}
