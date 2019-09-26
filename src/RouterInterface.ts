import { PageClass } from "./lib/Page";
import { DynamicImport } from "./lib/DynamicImport";

export interface RouterInterface {
  route(path: string, pageClass: PageClass, name?: string): void;
  asyncRoute(
    path: string,
    asyncPageClassFunction: () => Promise<PageClass | DynamicImport<PageClass>>,
    name?: string
  ): void;
}
