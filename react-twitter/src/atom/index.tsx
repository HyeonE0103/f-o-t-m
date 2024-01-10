import { atom } from "recoil";

export type LanguageType = "ko" | "en";

export const languageState = atom<LanguageType>({
  key: "language",
  default: (localStorage.getItem("language") as LanguageType) || "ko",
  //recoil은 전역상태관리이기 때문에 새로고침하면 초기화되서 해당 값을 localStorage에 저장해서 꺼내씀
});
