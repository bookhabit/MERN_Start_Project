import {createContext, useEffect, useState} from "react";
import axios from "axios";
import { UserType } from "./Types/userType";

export type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  ready: boolean;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  ready: false,
});

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      axios.get('/profile')
            .then(({data}:{data:UserType}) => {
              setUser(data);
              setReady(true);
            });
    }
  }, []);
  return (
    <UserContext.Provider value={{user,setUser,ready}}>
      {children}
    </UserContext.Provider>
  );
}