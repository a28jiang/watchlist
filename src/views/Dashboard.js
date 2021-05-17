import React, { useState } from "react";
import { Container, Row } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100vh",
    padding: "15%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "bold",
    [theme.breakpoints.down("xs")]: {
      fontSize: "12vw",
    },
    [theme.breakpoints.up("sm")]: {
      fontSize: "6vw",
    },
  },
  statText: {
    lineHeight: "2rem",
    fontSize: "14px",
    color: "gray",
  },
  userField: {
    "&.MuiFormControl-root": {
      width: "100%",
    },
  },
}));

const Dashboard = () => {
  const history = useHistory();
  const classes = useStyles();
  const [name, setName] = useState(localStorage.getItem("rideshare") || "");
  return (
    <div style={{ backgroundImage: "linear-gradient(#fffcf8, #b7dfe9)" }}>
      <Container className={classes.container}>
        <div>
          <Row className={classes.centered}>
            <h1 className={classes.header}>
              drive<span style={{ color: "#579fa3" }}>.ai 🚘</span>
            </h1>
          </Row>
          <Row className={classes.centered}>
            <p style={{ color: "gray" }}>
              How long you can last in the ridesharing industry?
            </p>
          </Row>
          <Row className={classes.centered}>
            <TextField
              className={classes.userField}
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Set a nickname"
              inputProps={{
                style: {
                  padding: "12px 16px",
                },
              }}
            />
          </Row>
          <Row className={classes.centered}>
            <Button
              disabled={name === ""}
              style={{
                marginTop: "32px",
                border: "2px solid",
              }}
              onClick={() => {
                localStorage.setItem("rideshare", name);
                history.push("/game");
              }}
              size="large"
              variant="outlined"
              color="primary"
            >
              Let's Go
            </Button>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
