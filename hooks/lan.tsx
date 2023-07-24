import { Dispatch, SetStateAction, createContext, useState } from "react";
import { ChildContainerProps } from "../types/types";
interface LangContextProps {
  textFormat: string;
  setTextFormat: Dispatch<SetStateAction<string>>;
}

export const LangContext = createContext({} as LangContextProps);

export const LangProvider = ({ children }: ChildContainerProps) => {
  const [textFormat, setTextFormat] = useState<string>("ar");

  const value = {
    textFormat,
    setTextFormat,
  };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};
