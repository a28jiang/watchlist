import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { signInWithGoogle } from "../services/userService";
import { StyledButton } from "../components/SharedComponent";
import hero from "../assets/hero.png";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "calc(90%)",
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
      <Grid container className={classes.container}>
        <Grid
          item
          container
          xs={12}
          sm={6}
          justify="center"
          alignContent="center"
        >
          <div>
            <Grid item>
              <h1 className={classes.header}>
                watch<span style={{ color: "#FFCD6B" }}>list.</span>
              </h1>
            </Grid>
            <Grid item>
              <p className={classes.subtitle}>binging simplified</p>
            </Grid>
            <Grid item style={{ marginTop: "10vh" }}>
              <StyledButton
                onClick={() => {
                  user ? history.push("/dashboard") : signInWithGoogle();
                }}
                text="LET'S GO"
              />
              <StyledButton
                onClick={() => console.log("LEARN MORE PRESSED")}
                text="LEARN MORE"
                outline
              />
            </Grid>
          </div>
        </Grid>
        <Grid container item xs={12} sm={6}>
          <img alt="hero" src={hero} style={{ maxWidth: "80%" }} />
        </Grid>
      </Grid>
      <Grid style={{ backgroundColor: "#FFCD6B", height: "500px" }}></Grid>
    </div>
  );
};

export default Landing;
