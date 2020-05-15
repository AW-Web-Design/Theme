import React, { ReactNode } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

import { ThemeModeEnum } from "../enums/themeModeEnum";
import createTheme from "./create-theme";
import { StyledDiv } from "./styled";

interface Props {
  children: ReactNode;
  theme?: object;
  mode?: ThemeModeEnum;
}

export const ThemeProvider = ({ children, theme, mode }: Props) => (
  <StyledThemeProvider theme={createTheme(theme, mode)}>
    <StyledDiv>{children}</StyledDiv>
  </StyledThemeProvider>
);
