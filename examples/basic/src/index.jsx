import React from "react";
import { render } from "react-dom";
import { createRouter } from "atarime";
import "nprogress/nprogress.css";
import { Home } from "./page/HomePage";
import { PageIndexPage } from "./page/PageIndexPage";
import { PagePage } from "./page/PagePage";

const router = createRouter();
router.route("/", Home);
router.route("/page", PageIndexPage);
router.route("/page/:pageId", PagePage);
router.run((Root) => {
  render(<Root />, document.getElementById("app"));
});
