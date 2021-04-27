import React, { useState, useEffect, useContext } from "react";
import { UserProvider, UserContext } from "../context/UserContext";
import Button from "@material-ui/core/Button";

export default function Test() {
  const [signedIn, setSignedIn] = useState(false);
  const user = useContext(UserContext);
  console.log("test", user);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("appuser", user);
  }, [user]);

  return (
    <div className="App">
      <h1>user:{user ? user.displayName : "n/a"}</h1>
    </div>
  );
}
