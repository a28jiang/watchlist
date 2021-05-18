import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col } from "reactstrap";
import { UserContext } from "../context/UserContext";
import { Button, Avatar } from "@material-ui/core";
import { handleLogout, signInWithGoogle } from "../services/userService";

const useStyles = makeStyles((theme) => ({
  navbar: {
    margin: 0,
    flexDirection: "column",
    padding: "8px 16px",
  },
  button: {
    "& span": {
      fontSize: "18px",
      paddingLeft: "12px",
      fontWeight: "bold",
    },
  },
  buttonBar: {
    alignSelf: "flex-end",
    margin: "2% 4%",
  },
  avatarStyle: {
    height: "72px",
    width: "72px",
  },
}));

export const Navbar = () => {
  const classes = useStyles();
  const user = useContext(UserContext);

  console.log("base", user);

  useEffect(() => {
    console.log("appuser", user);
  }, [user]);

  return (
    <Row className={classes.navbar}>
      <div className={classes.buttonBar}>
        {user ? (
          <Button onClick={() => handleLogout()}>
            <Avatar
              alt={user.displayName}
              src={user.photoURL}
              className={classes.avatarStyle}
            />
          </Button>
        ) : (
          <>
            <Button className={classes.button}>
              <span
                style={{ color: "#FFCD6B" }}
                onClick={() => signInWithGoogle()}
              >
                LOGIN
              </span>
            </Button>
            <Button className={classes.button}>
              <span
                style={{ color: "#FFEDC9" }}
                onClick={() => signInWithGoogle()}
              >
                SIGN UP
              </span>
            </Button>
          </>
        )}
      </div>
    </Row>
  );
};
