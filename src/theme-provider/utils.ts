import { ThemeModeEnum } from 'src/enums/themeModeEnum';

const THEME_TOKEN = 'theme::token';

export const getThemeMode = () => {
  return ThemeModeEnum[localStorage.getItem(THEME_TOKEN) ?? ''];
};

export const setThemeMode = mode => {
  localStorage.setItem(THEME_TOKEN, mode);
};
