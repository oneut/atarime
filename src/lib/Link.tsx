import * as React from "react";
import { Request } from "./Request";

interface LinkType {
  to: string;
  className?: string;
}

interface InternalLinkType {
  to: string;
  request: Request;
  className?: string;
}

class Link extends React.Component<InternalLinkType> {
  click(e: Event) {
    e.preventDefault();
    this.props.request.to(this.props.to, () => {
      window.scrollTo(0, 0);
    });
  }

  render() {
    return (
      <a
        href={this.props.to}
        className={this.props.className}
        onClick={this.click.bind(this)}
      >
        {this.props.children}
      </a>
    );
  }
}

export function createLink(
  request: Request
): React.FunctionComponent<LinkType> {
  return function LinkHoC(props: LinkType) {
    return <Link request={request} {...props} />;
  };
}
