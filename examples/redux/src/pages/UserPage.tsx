import { Page, Route } from "async-react-router2";
import NProgress from "nprogress";
import * as React from "react";
import { hackerNewsApi } from "../api/HackerNewsApi";
import { UserAttributesInterface } from "../attributes/UserAttributes";
import {
  configureModule,
  ModuleInterface
} from "../containers/user/configureModule";
import { Container } from "../containers/user/Container";

type RouteType = Route<{
  userId: number;
}>;

interface InitialPropsType {
  user: UserAttributesInterface;
}

export default class UserPage extends Page<RouteType, InitialPropsType> {
  private readonly module: ModuleInterface;

  constructor(route: RouteType) {
    super(route);
    this.module = configureModule();
  }

  initialPropsWillGet() {
    NProgress.start();
  }

  async getInitialProps() {
    return {
      user: await hackerNewsApi.findUser(this.route.params.userId)
    };
  }

  initialPropsDidGet() {
    NProgress.done();
  }

  component(initialProps: InitialPropsType) {
    this.module.actions.user.sync(initialProps.user);
    return (
      <this.module.hooks.Provider>
        <Container module={this.module} />
      </this.module.hooks.Provider>
    );
  }
}
