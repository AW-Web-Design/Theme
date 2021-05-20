import React, { ReactNode, useContext } from 'react';
import memoize from 'memoize-one';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

import { ThemeModeEnum } from '../enums/themeModeEnum';
import { GlobalThemeModeContext } from './GlobalThemeModeContext';
import createTheme from './create-theme';
import { StyledDiv } from './styled';

interface Props {
  children: ReactNode;
  theme?: object;
  mode?: ThemeModeEnum;
}

const forwardPropHelper = styledProps => (prop, defaultValidatorFn) => {
  const regex = new RegExp(`^(${styledProps.join('|')})$`);
  return defaultValidatorFn(prop) && !regex.test(prop);
};

export const shouldForwardProp = memoize(forwardPropHelper);

export const ThemeProvider = ({
  children,
  theme,
  mode = ThemeModeEnum.GLOBAL,
}: Props) => {
  const { mode: globalMode } = useContext(GlobalThemeModeContext);

  return (
    <StyledThemeProvider theme={createTheme(theme, mode, globalMode)}>
      <StyledDiv>{children}</StyledDiv>
    </StyledThemeProvider>
  );
};

export { getThemeMode, setThemeMode } from './utils';
export { ThemeModeEnum, GlobalThemeModeContext };
