import React, { createContext, ReactNode, SetStateAction, useState, Dispatch } from "react";
import { ThemeModeEnum } from "../enums/themeModeEnum";
import { getThemeMode } from "./utils";

interface Props {
  value: ThemeModeEnum;
  children: ReactNode;
}

interface Context {
  mode: ThemeModeEnum;
  setMode: Dispatch<SetStateAction<ThemeModeEnum>>;
}

const GlobalThemeModeContext = createContext<Context>({
  mode: ThemeModeEnum.DARK,
  setMode: () => {},
});

const GlobalThemeModeProvider = ({ children, value }: Props) => {
  const [mode, setMode] = useState<ThemeModeEnum>(getThemeMode() ?? value);

  const contextValue = {
    mode,
    setMode,
  };

  return <GlobalThemeModeContext.Provider value={contextValue}>{children}</GlobalThemeModeContext.Provider>;
};

const GlobalThemeModeConsumer = GlobalThemeModeContext.Consumer;

export { GlobalThemeModeContext, GlobalThemeModeConsumer, GlobalThemeModeProvider };
