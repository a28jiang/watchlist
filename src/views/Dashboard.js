import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Row } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { TextField, Grid } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {
  getTrending,
  searchMedia,
  getImg,
  mediaDetail,
} from "../services/movieService";

import { MediaDetail, MediaCard } from "../components/SharedComponent";
import { Schedule } from "../components/Schedule";
import MuiAlert from "@material-ui/lab/Alert";
import { ReactComponent as Background } from "../assets/design1.svg";

const getColors = require("get-image-colors");

const colourOptions = {
  count: 1,
  type: "image/png",
};

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
  searchImg: {
    height: "48px",
    width: "48px",
    borderRadius: "50%",
  },
  buttonText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#FFCD6B",
  },
}));

const sortOptions = (options, property) => {
  //sort by popularity and image availability
  return options
    .filter((option) => option.poster_path)
    .sort((a, b) =>
      a[property] < b[property] ? 1 : b[property] < a[property] ? -1 : 0
    );
};

const Dashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("Trending Now");
  const [accent, setAccent] = useState("rgba(255,237,201,0.2)");
  const [error, setError] = useState(false);
  // const [mediaType, setMediaType] = useState("tv");
  const { user, userAuth, loading } = useContext(UserContext);

  const switchAccent = (option) => {
    if (option) {
      getColors(getImg(option.poster_path), colourOptions).then((colors) => {
        const rgb = colors[0]._rgb;
        rgb.pop();
        setAccent(`rgba(${rgb.join(",")},0.3)`);
      });
    }
  };

  useEffect(() => {
    getTrending().then((val) => {
      const promises = val.results
        .slice(0, 4)
        .map((opt) => mediaDetail(opt.id, "tv"));

      if (promises) {
        Promise.all(promises).then((val) => {
          console.log(val);
          setOptions(val);
        });
      } else {
        setError(true);
        console.log("error", true);
        setTimeout(() => {
          setError(false);
          console.log("error", false);
        }, 2000);
      }
    });
  }, []);

  useEffect(() => {
    if (!userAuth && !loading) {
      history.push("/");
    }
  }, [userAuth, loading, history]);

  useEffect(() => {
    if (value) {
      const delayDebounceFn = setTimeout(() => {
        if (value.length >= 3)
          searchMedia(value, "tv").then((val) => {
            const promises = sortOptions(val, "popularity")
              .slice(0, 4)
              .map((opt) => mediaDetail(opt.id, "tv"));

            if (promises.length) {
              Promise.all(promises).then((val) => {
                switchAccent(val[0]);
                setOptions(val);
              });
            } else {
              setDescription(`No results for: ${value}`);
              setError(true);
              console.log("error", true);
              setTimeout(() => {
                setError(false);
                console.log("error", false);
              }, 2000);
            }
          });
      }, 750);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [value]);

  return (
    <>
      <div style={{ zIndex: 2 }}>
        {error && (
          <MuiAlert
            severity="error"
            style={{
              width: "50vw",
              position: "absolute",
              top: "5vh",
              left: "25vw",
              zIndex: 999,
            }}
          >
            Sorry there was an error while fetching your shows
          </MuiAlert>
        )}
        <Row className={classes.centered} style={{ margin: 0 }}>
          <TextField
            style={{ width: "80%" }}
            value={value}
            onChange={(e, val) => {
              if (selectedOption) setSelectedOption(null);
              setValue(e.target.value);
              setDescription(`Search results for: ${e.target.value}`);
            }}
            InputProps={{
              disableUnderline: true,
              endAdornment: <SearchIcon style={{ cursor: "pointer" }} />,
              style: {
                fontSize: "18px",
                padding: "12px 16px",
                backgroundColor: "white",
                borderRadius: "32px",
              },
            }}
            placeholder="Find a series (e.g. Attack on Titan)"
          />

          <Grid
            style={{
              width: "80%",
              zIndex: 2,
              marginTop: "36px",
              padding: "24px",
              paddingBottom: "32px",
              borderRadius: "24px",
              backgroundImage: `linear-gradient(#211D1C,${accent})`,
            }}
            container
          >
            <Grid
              style={{
                paddingBottom: "12px",
              }}
              item
              container
              justify={selectedOption ? "flex-end" : "flex-start"}
            >
              {selectedOption ? (
                <span
                  style={{ paddingRight: "12px", cursor: "pointer", zIndex: 2 }}
                  className={classes.buttonText}
                  onClick={() => {
                    setSelectedOption(null);
                  }}
                >
                  Go Back
                </span>
              ) : (
                <span
                  style={{ color: "#FFEDC9", fontWeight: 500 }}
                  className={classes.buttonText}
                >
                  {description}
                </span>
              )}
            </Grid>
            <Grid item container spacing={3}>
              {selectedOption ? (
                <MediaDetail option={selectedOption} user={user} />
              ) : (
                options.slice(0, 4).map((option) => {
                  return (
                    <MediaCard
                      key={option.id}
                      option={option}
                      setSelectedOption={() => {
                        setSelectedOption(option);
                        switchAccent(option);
                      }}
                    />
                  );
                })
              )}
            </Grid>
          </Grid>
          <Grid
            style={{ marginTop: "36px" }}
            container
            justify="center"
            xs={12}
          >
            <Schedule />
          </Grid>
        </Row>
      </div>
      <Background style={{ width: "100%", position: "sticky", bottom: 0 }} />
    </>
  );
};

export default Dashboard;
