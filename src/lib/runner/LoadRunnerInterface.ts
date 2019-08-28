import * as React from "react";
import { RootProps } from "../RootComponent";

export interface LoadRunnerInterface {
  run(callback: (Root: React.FunctionComponent<RootProps>) => void): void;
}
