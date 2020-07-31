import { green, red, blue, yellow, bold, reset } from "../../deps.ts";

export type DebugTypes = "debug" | "info" | "warning" | "error" | "critical";

// There is ~~probably~~ most definitely a much better way to deal with this.
// Too bad.
export function fear(type: DebugTypes, text: string) {
  var debug = false;
  switch (type) {
    case "debug":
      if (debug) {
        console.log(bold(green("[coward] debug: ")) + reset(text));
      }
      break;
    case "info":
      console.log(bold(green("[coward] info: ")) + reset(text));
      break;
    case "warning":
      console.log(bold(yellow("[coward] warning: ")) + reset(text));
      break;
    case "error":
      console.error(bold(red("[coward] error: ")) + reset(text));
      break;
    case "critical":
      console.error(bold(red("[coward] critical: ")) + reset(text));
      break;
  }
}
