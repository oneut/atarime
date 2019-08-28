import {Connector} from "./Connector";

export class Request {
    private readonly connector: Connector;

    constructor(connector: Connector) {
        this.connector = connector;
    }

    to(to: string, callback: () => void = () => {
    }) {
        this.connector.getHistoryManager().push(normalizeTo(to), callback);
    }

    name(name: string, parameters: any = {}, callback: () => void = () => {
    }) {
        const pathname = this.connector.getRouteMatcher().compileByName(
            name,
            parameters
        );
        this.connector.getHistoryManager().push(pathname, callback);
    }

    isActive(pathname: string) {
        const location = this.connector.getHistoryManager().getLocation();
        return location.pathname === pathname;
    }
}

function normalizeTo(to: string) {
    if (to[0] === "#") {
        return to.substr(1);
    }

    return to;
}
