import run from "@hyeon/esbuild-config";
import pkg from "./package.json" assert { type: "json" };
import { vanillaExtractPlugin } from "@vanilla-extract/esbuild-plugin";

const config = {
  plugins: [vanillaExtractPlugin()],
};

run({
  pkg,
  config,
});
//공통 esbuild-config를 확인해보면 config를 전달받아서
//destructuring(비구조화, 구조파괴) 넣어주는 방식을 취하고 있음
//따라서 config 오브젝트를 만들어서 전달
