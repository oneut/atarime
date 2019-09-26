/* eslint-disable @typescript-eslint/no-var-requires */
import Merge from "webpack-merge";
import webpack from "webpack";
import { commonConfig } from "./webpack.config.common";

module.exports = Merge(commonConfig, {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: ["webpack-hot-middleware/client?reload=true&timeout=1000"],
  plugins: [new webpack.HotModuleReplacementPlugin()]
});
