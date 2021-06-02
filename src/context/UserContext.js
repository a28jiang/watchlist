import React, { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../firebase";
import { getUserInfo } from "../services/userService";

const UserContext = createContext({ user: null });

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(0);

  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      console.log("auth", userAuth);
      getUserInfo(userAuth.uid);
      setUser(userAuth);
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export { UserProvider, UserContext };
