import React, { useState, useEffect, useContext } from "react";
import logo from "./logo.svg";
import { auth, db } from "./firebase";
import Test from "./components/Test";
import firebase from "firebase/app";
import { UserProvider, UserContext } from "./context/UserContext";
import Button from "@material-ui/core/Button";

export default function App() {
  const provider = new firebase.auth.GoogleAuthProvider();

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
      <UserProvider>
        <Test />

        <Button onClick={() => signInWithGoogle()}>Sign in</Button>
        <Button onClick={() => handleLogout()}>Sign out</Button>
      </UserProvider>
    </div>
  );
}
