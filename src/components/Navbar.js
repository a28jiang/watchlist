import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col } from "reactstrap";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  navbar: {
    margin: 0,
    flexDirection: "column",
    padding: "8px 16px",
  },
  button: {
    alignSelf: "flex-end",
  },
}));

export const Navbar = ({ user }) => {
  const classes = useStyles();
  // const [signedIn, setSignedIn] = useState(false);
  // const user = useContext(UserContext);
  // console.log("test", user);
  // const [error, setError] = useState("");

  useEffect(() => {
    console.log("appuser", user);
  }, [user]);

  return (
    <Row className={classes.navbar}>
      <div className={classes.button}>
        <Button>
          <span
            style={{ fontSize: "18px", fontWeight: "bold", color: "#FFCD6B" }}
          >
            LOGIN
          </span>
        </Button>
        <Button className={classes.button}>
          <span
            style={{ fontSize: "18px", fontWeight: "bold", color: "#FFEDC9" }}
          >
            SIGN UP
          </span>
        </Button>
      </div>
    </Row>
  );
};
