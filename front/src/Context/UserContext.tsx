import {createContext, useEffect, useState} from "react";
import axios from "axios";
import { UserType } from "../Types/userType";

export type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);  
  useEffect(() => {
    if (!user) {
      axios.get('/profile')
      .then((response)=>{
        if(response.status===200){
          setUser(response.data as UserType)
        }else{
          setUser(null)
        }
      })
    }
  }, []);
  return (
    <UserContext.Provider value={{user,setUser}}>
      {children}
    </UserContext.Provider>
  );
}