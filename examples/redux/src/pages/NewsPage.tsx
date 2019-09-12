import { Page, Route } from "async-react-router2";
import * as React from "react";
import NProgress from "nprogress";
import { ItemAttributesInterface } from "../attributes/ItemAttributes";
import {
  configureModule,
  ModuleInterface
} from "../containers/news/configureModule";
import { hackerNewsApi } from "../api/HackerNewsApi";
import { Container } from "../containers/news/Container";
import { NotFound } from "../layout/error/NotFound";

type RouteType = Route<{
  page?: number;
}>;

interface InitialPropsType {
  items: ItemAttributesInterface[];
}

export default class NewsPage extends Page<RouteType, InitialPropsType> {
  private module: ModuleInterface;

  constructor(route: RouteType) {
    super(route);
    this.module = configureModule();
  }

  initialPropsWillGet() {
    NProgress.start();
  }

  async getInitialProps() {
    return {
      items: await hackerNewsApi.getTopStoryItems(this.route.params.page)
    };
  }

  initialPropsDidGet(initialProps: InitialPropsType) {
    NProgress.done();
  }

  component(initialProps: InitialPropsType) {
    if (initialProps.items.length === 0) return <NotFound />;

    this.module.actions.items.sync(initialProps.items);
    return (
      <this.module.hooks.Provider>
        <Container module={this.module} page={this.route.params.page || 1} />
      </this.module.hooks.Provider>
    );
  }
}
