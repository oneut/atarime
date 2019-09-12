import * as React from "react";
import { render } from "react-dom";
import { createRouter } from "async-react-router2";
import "font-awesome/css/font-awesome.min.css";
import "nprogress/nprogress.css";
import "typeface-roboto";
import { App } from "./layout/App";
import "bootstrap/dist/css/bootstrap.css";

function FirstComponent() {
  return (
    <App>
      <div className="text-center m-5">
        <i className="fa fa-cog fa-spin fa-5x fa-fw" />
      </div>
    </App>
  );
}

const router = createRouter();
router.asyncRoute("/", () => import("./pages/IndexPage"), "IndexPage");
router.asyncRoute(
  "/item/:itemId",
  () => import("./pages/ItemPage"),
  "ItemPage"
);
router.asyncRoute("/news/:page?", () => import("./pages/NewsPage"), "NewsPage");
router.asyncRoute(
  "/user/:userId",
  () => import("./pages/UserPage"),
  "UserPage"
);
router.asyncRoute("(.*)", () => import("./pages/NotFoundPage"));

router.runWithFirstComponent(FirstComponent, (Root) => {
  render(<Root />, document.getElementById("app"));
});
