import React, { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../firebase";

const UserContext = createContext({ user: null });

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(0);

  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      console.log("auth", userAuth);

      setUser(userAuth);
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
