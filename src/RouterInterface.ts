import { PageClass } from "./lib/Page";

export interface RouterInterface {
  route(path: string, pageClass: PageClass, name?: string): void;
  asyncRoute(
    path: string,
    asyncPageClassFunction: () => Promise<PageClass>,
    name?: string
  ): void;
}
