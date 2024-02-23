import run from "@hyeon/esbuild-config";
import pkg from "./package.json" assert { type: "json" };

run({
  pkg,
});
