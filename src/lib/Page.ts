import * as React from "react";

export type PageType<R = {}, I = {}> = Page<Route<R>, I>;

export type PageClass<R = {}, I = {}> = new (route: R) => PageType<R, I>;

export class Route<P> {
    _route: any;
    params: P;
    pathname: string;

    constructor(params: P, pathname: string) {
        this.params = params;
        this.pathname = pathname;
    }
}

type RouteType<P = {}> = Route<P>

export abstract class Page<R extends RouteType, InitialProps extends {}> {
    protected route: R;

    constructor(route: R) {
        this.route = route;
    }

    public initialPropsWillGet() {

    }

    async getInitialProps(): Promise<InitialProps | {}> {
        return {};
    }

    public initialPropsDidGet(initialProps: InitialProps) {

    }

    abstract component(initialProps: InitialProps): React.ReactElement;
}