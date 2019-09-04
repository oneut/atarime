import PathToRegexp from "path-to-regexp";
import { Renderer } from "./Renderer";
import { PageClass } from "./Page";
import { Route } from "./Route";

interface PageInfo {
  path: string;
  asyncPageClass: Promise<PageClass>;
}

function normalizePathname(pathname: string) {
  return pathname.split("?")[0].split("#")[0];
}

export class RouteMatcher {
  private readonly pageInfos: Array<PageInfo>;
  private readonly nameRoutes: Record<string, string>;

  constructor() {
    this.pageInfos = [];
    this.nameRoutes = {};
  }

  newInstance() {
    return new RouteMatcher();
  }

  addRoute(path: string, promisePageClass: Promise<PageClass>, name?: string) {
    this.pageInfos.push({ path, asyncPageClass: promisePageClass });
    if (name) {
      this.nameRoutes[name] = path;
    }
  }

  createRenderer(pathname: string, requestCallback: () => void = () => {}) {
    const normalizedPathname = normalizePathname(pathname);
    for (let i = 0; this.pageInfos.length > i; i++) {
      const keys: PathToRegexp.Key[] = [];
      const pageInfo = this.pageInfos[i];
      const routeMatch = PathToRegexp(pageInfo.path, keys).exec(
        normalizedPathname
      );
      if (!routeMatch) continue;

      const params = {};
      for (let i = 1, len = routeMatch.length; i < len; ++i) {
        const key = keys[i - 1];
        params[key.name] = isNaN(Number(routeMatch[i]))
          ? decodeURIComponent(routeMatch[i])
          : Number(routeMatch[i]);
      }

      return pageInfo.asyncPageClass.then((PageClass) => {
        return new Renderer(
          new PageClass(new Route(params, pathname)),
          requestCallback
        );
      });
    }

    return Promise.resolve(null);
  }

  compileByName(name: string, parameters: { [key: string]: any } = {}) {
    if (!this.nameRoutes[name]) {
      throw Error(`Route Name "${name}" did not match Path.`);
    }

    const toPath = PathToRegexp.compile(this.nameRoutes[name]);
    return toPath(parameters);
  }
}
