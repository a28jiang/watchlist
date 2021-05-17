import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { auth, db } from "./firebase";
import firebase from "firebase/app";
import { UserProvider, UserContext } from "./context/UserContext";
import { Navbar } from "./components/Navbar";
import Landing from "./views/Landing";
import Dashboard from "./views/Dashboard";

export default function App() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const user = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch {
      console.log("Failed to log out");
    }
  };

  const signInWithGoogle = async () => {
    //Added the isNewUser property to firebase.auth.AdditionalUserInfo
    await auth.signInWithPopup(provider).then((user) => {
      const obj = user.user;
      return db.collection("users").doc(obj.uid).set({
        name: obj.displayName,
        email: obj.email,
        photo: obj.photoURL,
        type: "basic",
      });
    });
  };

  return (
    <div className="App">
      <div style={{ backgroundImage: "linear-gradient(#544E4A, #000000)" }}>
        <UserProvider>
          <Navbar user={user} />
          {/* <Test /> */}
          {/* <Button onClick={() => signInWithGoogle()}>Sign in</Button>
        <Button onClick={() => handleLogout()}>Sign out</Button> */}
          <Router>
            <div>
              <Switch>
                <Route path="/">
                  <Landing />
                </Route>
                <Route path="/dashboard">
                  <Dashboard />
                </Route>
              </Switch>
            </div>
          </Router>
        </UserProvider>
      </div>
    </div>
  );
}
