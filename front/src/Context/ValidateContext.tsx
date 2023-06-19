import {Dispatch, SetStateAction, createContext, useEffect, useState} from "react";

export type ValidateContextType = {
  validateMode :boolean
  setValidateMode: Dispatch<SetStateAction<boolean>>
};

export const ValidateContext = createContext<ValidateContextType>({
    validateMode: false,
    setValidateMode: () => {},
});

export function ValidateContextProvider({ children }: { children: React.ReactNode }) {
  const [validateMode, setValidateMode] = useState<boolean>(false);  
  
  return (
    <ValidateContext.Provider value={{validateMode,setValidateMode}}>
      {children}
    </ValidateContext.Provider>
  );
}