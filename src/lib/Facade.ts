import { createHashHistory } from "history";
import * as React from "react";
import { HistoryManager } from "./HistoryManager";
import { Request } from "./Request";
import { RouteMatcher } from "./RouteMatcher";
import { URL } from "./URL";
import { createLink, LinkType } from "./Link";
import { Connector } from "./Connector";
import { ComponentResolver } from "./ComponentResolver";

const routeMatcher = new RouteMatcher();
const historyManager = new HistoryManager(createHashHistory());
const componentResolver = new ComponentResolver();
const connector = new Connector(
  historyManager,
  routeMatcher,
  componentResolver
);

const request = new Request(connector);

const url = new URL(connector);

const link: React.FunctionComponent<LinkType> = createLink(request);

export { link as Link, request as Request, url as URL, connector };
