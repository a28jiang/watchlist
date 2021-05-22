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
          <Router>
            <div>
              <Switch>
                <Route path="/dashboard">
                  <Dashboard />
                </Route>
                <Route path="/">
                  <Landing />
                </Route>
              </Switch>
            </div>
          </Router>
        </UserProvider>
      </div>
    </div>
  );
}
