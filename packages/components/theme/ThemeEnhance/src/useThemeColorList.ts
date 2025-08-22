import type { ThemeEnhance } from "@mist/config";
import { computed } from "vue";
import { useLocale } from "@mist/composables";
import { isBoolean, isClient } from "@mist/helper";
import { useMistConfig } from "@mist/components/theme/ConfigProvider";
import { ThemeColorName, ThemeColorOption } from "./themeEnhance";

/**
 * 获取主题色列表
 */
export const useThemeColorList = () => {
  if (!isClient) return;

  const { getMistConfigRef } = useMistConfig();
  const themeEnhanceConfig = getMistConfigRef<ThemeEnhance>("themeEnhance", {});

  const { t } = useLocale();

  return computed(() => {
    const { customize = false, append = [] } = themeEnhanceConfig.value.themeColor || {};

    const useVitepressTheme = isBoolean(customize) ? customize === false : (customize?.vitepressTheme ?? true);
    const useElementPlusTheme = isBoolean(customize) ? customize === false : (customize?.elementPlusTheme ?? true);

    const vitePressThemeColorList = useVitepressTheme
      ? [
          {
            label: t("mt.themeEnhance.themeColor.vpLabel"),
            tip: t("mt.themeEnhance.themeColor.vpTip"),
            options: [
              {
                value: ThemeColorName.vpDefault,
                label: t("mt.themeEnhance.themeColor.defaultLabel"),
                title: `VitePress ${t("mt.themeEnhance.themeColor.defaultLabel")}`,
                ariaLabel: `VitePress ${t("mt.themeEnhance.themeColor.defaultLabel")}`,
                color: getComputedStyle(document.documentElement).getPropertyValue("--vp-c-indigo-1"),
              },
              {
                value: ThemeColorName.vpGreen,
                label: t("mt.themeEnhance.themeColor.greenLabel"),
                title: `VitePress ${t("mt.themeEnhance.themeColor.greenLabel")}`,
                ariaLabel: `VitePress ${t("mt.themeEnhance.themeColor.greenLabel")}`,
                color: getComputedStyle(document.documentElement).getPropertyValue("--vp-c-green-1"),
              },
              {
                value: ThemeColorName.vpYellow,
                label: t("mt.themeEnhance.themeColor.yellowLabel"),
                title: `VitePress ${t("mt.themeEnhance.themeColor.yellowLabel")}`,
                ariaLabel: `VitePress ${t("mt.themeEnhance.themeColor.yellowLabel")}`,
                color: getComputedStyle(document.documentElement).getPropertyValue("--vp-c-yellow-1"),
              },
              {
                value: ThemeColorName.vpRed,
                label: t("mt.themeEnhance.themeColor.redLabel"),
                title: `VitePress ${t("mt.themeEnhance.themeColor.redLabel")}`,
                ariaLabel: `VitePress ${t("mt.themeEnhance.themeColor.redLabel")}`,
                color: getComputedStyle(document.documentElement).getPropertyValue("--vp-c-red-1"),
              },
            ],
          },
        ]
      : [];

    const elementPlusThemeColorList = useElementPlusTheme
      ? [
          {
            label: t("mt.themeEnhance.themeColor.epLabel"),
            tip: t("mt.themeEnhance.themeColor.epTip"),
            options: [
              {
                value: ThemeColorName.epBlue,
                label: `${t("mt.themeEnhance.themeColor.blueLabel")}`,
                title: `ElementPlus ${t("mt.themeEnhance.themeColor.blueLabel")}`,
                ariaLabel: `ElementPlus ${t("mt.themeEnhance.themeColor.blueLabel")}`,
                color: getComputedStyle(document.documentElement).getPropertyValue("--mt-el-color-primary"),
              },
              {
                value: ThemeColorName.epGreen,
                label: `${t("mt.themeEnhance.themeColor.greenLabel")}`,
                title: `ElementPlus ${t("mt.themeEnhance.themeColor.greenLabel")}`,
                ariaLabel: `ElementPlus ${t("mt.themeEnhance.themeColor.greenLabel")}`,
                color: getComputedStyle(document.documentElement).getPropertyValue("--mt-el-color-success"),
              },
              {
                value: ThemeColorName.epYellow,
                label: `${t("mt.themeEnhance.themeColor.yellowLabel")}`,
                title: `ElementPlus ${t("mt.themeEnhance.themeColor.yellowLabel")}`,
                ariaLabel: `ElementPlus ${t("mt.themeEnhance.themeColor.yellowLabel")}`,
                color: getComputedStyle(document.documentElement).getPropertyValue("--mt-el-color-warning"),
              },
              {
                value: ThemeColorName.epRed,
                label: `${t("mt.themeEnhance.themeColor.redLabel")}`,
                title: `ElementPlus ${t("mt.themeEnhance.themeColor.redLabel")}`,
                ariaLabel: `ElementPlus ${t("mt.themeEnhance.themeColor.redLabel")}`,
                color: getComputedStyle(document.documentElement).getPropertyValue("--mt-el-color-danger"),
              },
            ],
          },
        ]
      : [];

    return [...vitePressThemeColorList, ...elementPlusThemeColorList, ...append] as {
      label: string;
      tip: string;
      options: ThemeColorOption[];
    }[];
  });
};
