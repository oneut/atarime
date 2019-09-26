import { Connector } from "./Connector";

export class URL {
  private readonly connector: Connector;

  constructor(connector: Connector) {
    this.connector = connector;
  }

  to(pathname: string) {
    return this.connector.createHref(pathname);
  }

  name(name: string, parameters: { [key: string]: any } = {}) {
    return this.connector.createHrefByName(name, parameters);
  }
}
