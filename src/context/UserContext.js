import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { getUser, getShows } from "../services/userService";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [userAuth, setUserAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    if (userAuth && userAuth.uid) {
      getUser(userAuth.uid, setUser); // listen for user updates
      getShows(userAuth.uid, setShows); // listen for show updates
    }
  }, [userAuth]);

  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setUserAuth(userAuth);
      } else {
        setUserAuth(null);
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, user, shows, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
