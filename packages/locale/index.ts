export type LocalesItem = {
  [key: string]: string | string[] | LocalesItem;
};

export type Language = {
  lang: string;
  mt: LocalesItem;
};

export { default as zhCn } from "./lang/zh-cn";
export { default as en } from "./lang/en";
