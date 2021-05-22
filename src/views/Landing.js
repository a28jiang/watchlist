import React, { useState, useContext } from "react";
import { Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { signInWithGoogle } from "../services/userService";
import { StyledTextField, StyledButton } from "../components/SharedComponent";
import hero from "../assets/hero.png";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: 0,
  },
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: "32px",
    "&.MuiButton-outlinedPrimary": {
      border: "3px solid rgba(87, 159, 163, 0.5)",
    },
  },

  header: {
    fontFamily: "typeface-playfair-display",
    fontWeight: "bold",
    color: "#FFEDC9",
    [theme.breakpoints.down("xs")]: {
      fontSize: "3vw",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "7vw",
    },
  },
  subtitle: {
    color: "gray",
    fontSize: "2vw",
    margin: "-10px auto auto 8px",
  },
  userField: {
    "&.MuiFormControl-root": {
      width: "100%",
    },
  },
}));

const Landing = () => {
  const classes = useStyles();
  const user = useContext(UserContext);
  const history = useHistory();

  return (
    <div>
      <Row className={classes.container}>
        <Col className={classes.centered}>
          <div>
            <Row>
              <h1 className={classes.header}>
                watch<span style={{ color: "#FFCD6B" }}>list.</span>
              </h1>
            </Row>
            <Row>
              <p className={classes.subtitle}>binging simplified</p>
            </Row>
            <Row style={{ marginTop: "10vh" }}>
              <StyledButton
                onClick={() => {
                  user ? history.push("/dashboard") : signInWithGoogle();
                }}
                text="LET'S GO"
              />
              <StyledButton
                onClick={() => console.log("hi")}
                text="LEARN MORE"
                outline
              />
            </Row>
          </div>
        </Col>
        <Col>
          <img src={hero} width="90%" />
        </Col>
      </Row>
      <Row style={{ backgroundColor: "#FFCD6B", height: "500px" }}></Row>
    </div>
  );
};

export default Landing;
