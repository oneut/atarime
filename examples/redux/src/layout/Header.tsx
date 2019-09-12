import * as React from "react";
import { Link, URL } from "async-react-router2";

export default class Header extends React.Component {
  render() {
    return (
      <header className="navbar navbar-expand-lg bg-dark text-white mb-3">
        <div className="container">
          <div className="navbar-brand mb-0 h1">
            <Link to={URL.name("IndexPage")} className="text-white">
              Redux Example - Hacker News
            </Link>
          </div>
        </div>
      </header>
    );
  }
}
