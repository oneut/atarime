export type RouteType<P = {}> = Route<P>;

export class Route<P> {
  _route: any;
  params: P;
  pathname: string;

  constructor(params: P, pathname: string) {
    this.params = params;
    this.pathname = pathname;
  }
}
