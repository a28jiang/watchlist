import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { signInWithGoogle } from "../services/userService";
import { StyledButton } from "../components/SharedComponent";
import hero from "../assets/hero.png";
import hero2 from "../assets/hero2.png";
import { Grid } from "@material-ui/core";
import { DemoSchedule } from "../components/Schedule";
const useStyles = makeStyles((theme) => ({
  container: {
    height: "calc(95%)",
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
  secondaryHeader: {
    color: "#383333",
    fontWeight: "bold",
    paddingBottom: "16px",
    fontSize: "2.25rem",
  },
  subtitle: {
    color: "gray",
    fontSize: "2vw",
    margin: "-10px auto auto 8px",
  },
  bodyText: {
    color: "#4A4441",
    fontSize: "1.25rem",
  },
  userField: {
    "&.MuiFormControl-root": {
      width: "100%",
    },
  },
  accent: {
    color: "#DA555B",
  },
  yellowBackdrop: {
    backgroundColor: "#FFCD6B",
    marginBottom: "24px",
  },
  gridPadding: {
    padding: "30px",
  },
}));

const Landing = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
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
                  user
                    ? history.push("/dashboard")
                    : signInWithGoogle().then(
                        (loggedIn) => loggedIn && history.push("/dashboard")
                      );
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
          <img alt="hero" src={hero} style={{ maxWidth: "85%" }} />
        </Grid>
      </Grid>
      <Grid container className={classes.yellowBackdrop}>
        <Grid container item xs={12} sm={6}>
          <img alt="hero2" src={hero2} style={{ maxWidth: "80%" }} />
        </Grid>
        <Grid container item xs={12} sm={6} alignItems="center">
          <Grid item className={classes.gridPadding}>
            <h2 className={classes.secondaryHeader}>
              Keep up with all your
              <br />
              <span className={classes.accent}>favourite shows!</span>
            </h2>
            <span className={classes.bodyText}>
              Your personal watchlist to keep track of your favourite shows,
              movies and more! Set up custom reminders, share lists with friends
              and categorize your shows to stay on top of your game!
            </span>
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.gridPadding} container direction="column">
        <Grid container justify="center" item>
          <h2 style={{ color: "#FFEDC9" }} className={classes.secondaryHeader}>
            Ridiculously <span style={{ color: "#FFCD6B" }}>easy to use</span>
          </h2>
          <span
            className={classes.bodyText}
            style={{ color: "gray", marginBottom: "24px" }}
          >
            A clean, intuitive scheduling interface that makes tracking upcoming
            shows a piece of cake
          </span>
        </Grid>
        <Grid container item justify="center">
          <DemoSchedule />
        </Grid>
      </Grid>
    </div>
  );
};

export default Landing;
