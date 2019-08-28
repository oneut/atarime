import { PageType } from "./Page";

export class Renderer {
  private data: {};
  private page: PageType;
  private readonly requestCallback: () => void;

  constructor(page: PageType, requestCallback: () => void = () => {}) {
    this.data = {};
    this.page = page;
    this.requestCallback = requestCallback;
  }

  getComponent() {
    return this.page.component(this.getComponentProps());
  }

  getComponentProps() {
    return Object.assign(this.data);
  }

  fireInitialPropsWillGet() {
    this.page.initialPropsWillGet();
    return this;
  }

  fireGetInitialProps() {
    return Promise.resolve(this.page.getInitialProps()).then((params) => {
      this.data = params;
      return this;
    });
  }

  fireInitialPropsDidGet() {
    this.page.initialPropsDidGet(this.getComponentProps());
    return this;
  }

  fireRequestCallback() {
    this.requestCallback();
    return this;
  }

  setInitialProps(data?: {}) {
    if (!data) {
      this.data = {};
      return this;
    }

    this.data = data;
    return this;
  }
}
