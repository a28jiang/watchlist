import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { UserProvider } from "./context/UserContext";
import { Navbar } from "./components/Navbar";
import Landing from "./views/Landing";
import Dashboard from "./views/Dashboard";

export default function App() {
  return (
    <div className="App">
      <div style={{ backgroundImage: "linear-gradient(#544E4A, #000000)" }}>
        <UserProvider>
          <Navbar />
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
