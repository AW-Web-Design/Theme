import deepMerge from "deepmerge";
import { ThemeModeEnum } from "../enums/themeModeEnum";

const arrayMerge = (destination, source) => source;

const getActiveMode = (theme, parent, mode) => {
  if (mode) return mode;
  if (theme && theme.colors && theme.colors.mode) return theme.colors.mode;
  if (parent && parent.colors && parent.colors.mode) return parent.colors.mode;

  return ThemeModeEnum.LIGHT;
};

const applyMode = (theme, mode, globalMode) => {
  if (theme && theme.colors && theme.colors.modes) {
    const colors = { ...theme.colors };

    if (theme.colors.modes[mode]) {
      return { ...theme, mode, globalMode, colors: deepMerge(colors, colors.modes[mode], { arrayMerge }) };
    }
    if (theme.colors.modes[ThemeModeEnum.LIGHT]) {
      return {
        ...theme,
        mode,
        globalMode,
        colors: deepMerge(colors, colors.modes[ThemeModeEnum.LIGHT], { arrayMerge }),
      };
    }

    return { ...theme, mode, globalMode, colors };
  }

  return theme;
};

const createTheme = (theme?: any, mode?: ThemeModeEnum, globalMode?: ThemeModeEnum) => (parent?: any) => {
  if (mode === ThemeModeEnum.GLOBAL) {
    mode = globalMode;
  }

  const activeMode = getActiveMode(theme, parent, mode);
  const themeWithAppliedMode = applyMode(theme, activeMode, globalMode);
  const parentWithAppliedMode = applyMode(parent, activeMode, globalMode);

  if (parentWithAppliedMode && themeWithAppliedMode)
    return deepMerge(parentWithAppliedMode, themeWithAppliedMode, { arrayMerge });
  if (themeWithAppliedMode) return themeWithAppliedMode;
  if (parentWithAppliedMode) return parentWithAppliedMode;

  return {};
};

export default createTheme;
