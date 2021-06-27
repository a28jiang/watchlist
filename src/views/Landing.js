import React, { useContext, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { signInWithGoogle } from "../services/userService";
import { StyledButton } from "../components/SharedComponent";
import hero from "../assets/hero.png";
import hero2 from "../assets/hero2.png";
import { Grid } from "@material-ui/core";
import { DemoSchedule } from "../components/Schedule";
import clsx from "clsx";

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
    fontSize: "7vw",
    [theme.breakpoints.down("xs")]: {
      fontSize: "48px",
    },
  },
  secondaryHeader: {
    color: "#2c2828",
    fontWeight: "bold",
    paddingBottom: "16px",
    fontSize: "2.25rem",
  },
  subtitle: {
    color: "gray",
    fontSize: "28px",
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
  },
  gridPadding: {
    padding: "30px",
  },
  gridSection: {
    padding: "48px",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "64px",
    },
  },
  item2: {
    order: 0,
    [theme.breakpoints.down("sm")]: {
      order: 1,
    },
  },
  heroImage: {
    maxWidth: "85%",
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "48px",
      maxWidth: "100%",
    },
  },
  heroImage2: {
    maxWidth: "85%",
    objectFit: "contain",
    [theme.breakpoints.down("sm")]: {
      maxWidth: "60%",
    },
  },
  backgroundGradient: {
    paddingTop: "64px",
    backgroundImage: "linear-gradient(#403B38, #000000)",
  },
  bottomPadding: {
    paddingBottom: "72px",
  },
}));

const Landing = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const history = useHistory();
  const learnMoreRef = useRef(null);

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
          className={classes.gridPadding}
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
            <Grid
              item
              alignItems="center"
              container
              spacing={3}
              style={{ marginTop: "32px" }}
            >
              <Grid item>
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
              </Grid>
              <Grid item>
                <StyledButton
                  onClick={() =>
                    learnMoreRef.current.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  text="LEARN MORE"
                  outline
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid
          container
          justify="center"
          alignItems="flex-end"
          item
          xs={12}
          sm={6}
        >
          <img alt="hero" src={hero} className={classes.heroImage} />
        </Grid>
      </Grid>
      <Grid ref={learnMoreRef} container className={classes.yellowBackdrop}>
        <Grid
          container
          alignItems="flex-end"
          justify="center"
          item
          xs={12}
          md={6}
          className={classes.item2}
        >
          <img alt="hero2" src={hero2} className={classes.heroImage2} />
        </Grid>
        <Grid container item xs={12} md={6} alignItems="center">
          <Grid item className={classes.gridSection} justify="center" xs={12}>
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
            <br />
            <StyledButton
              style={{ marginTop: "36px" }}
              setColor="#2c2828"
              onClick={() => {
                user
                  ? history.push("/dashboard")
                  : signInWithGoogle().then(
                      (loggedIn) => loggedIn && history.push("/dashboard")
                    );
              }}
              text="GET STARTED"
              outline
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        className={clsx(classes.gridPadding, classes.backgroundGradient)}
        container
        direction="column"
      >
        <Grid container item>
          <Grid container justify="center" item xs={12}>
            <h2
              style={{ color: "#FFEDC9" }}
              className={classes.secondaryHeader}
            >
              Ridiculously <span style={{ color: "#FFCD6B" }}>easy to use</span>
            </h2>
          </Grid>
          <Grid container justify="center" item xs={12}>
            <span
              className={classes.bodyText}
              style={{
                color: "gray",
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              A clean, intuitive scheduling interface that makes tracking
              upcoming shows and movies a piece of cake.
              <br />
              <span style={{ fontStyle: "italic" }}>
                Hover over this demo to learn more!
              </span>
            </span>
          </Grid>
        </Grid>
        <Grid className={classes.bottomPadding} container item justify="center">
          <DemoSchedule />
        </Grid>
      </Grid>
    </div>
  );
};

export default Landing;
