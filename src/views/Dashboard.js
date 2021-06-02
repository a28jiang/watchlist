import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Grid,
  Modal,
} from "@material-ui/core";
import Image from "material-ui-image";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  getTrending,
  searchMedia,
  getImg,
  mediaDetail,
  addToWatchlist,
} from "../services/movieService";
import { GoogleAuth } from "../services/gapiService";
import { renderStars, StyledButton } from "../components/SharedComponent";
import useAsyncEffect from "use-async-effect";

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
}));

const AddMediaModal = ({ open, setOpen, option }) => {
  return (
    <Modal open={open}>
      <Paper>
        <Grid container spacing={3} xs={3}>
          <Grid item>
            <Image
              style={{
                height: "20vw",
                width: "100%",
              }}
              src={getImg(option.poster_path)}
              alt={option.name}
            />
          </Grid>
          <Grid item container xs={9}>
            <Grid item>
              <h2>{option.name}</h2>
            </Grid>
            <Grid item>
              <span style={{ marginRight: "16px" }}>
                {option.first_air_date || "N/A"}
              </span>
              {renderStars(option.vote_average / 2)}
            </Grid>
            <Grid item>{option.overview}</Grid>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
};

const renderDate = (detail) => {
  if (detail) {
    const first = detail.first_air_date;
    const last = detail.last_air_date;
    if ((first && detail.status !== "Ended") || (first && !last))
      return `${first.substring(0, 4)} -`;
    else if (first && last)
      return `${first.substring(0, 4)} - ${last.substring(0, 4)}`;
  } else return "N/A";
};

const MediaCard = ({ option }) => {
  const [toolTip, setToolTip] = useState(false);

  // mediaDetail(option.id, "tv").then((val) => {
  //   console.log("val", val);
  //   setDetail(val);
  // });

  // useAsyncEffect(async (isMounted) => {
  //   const response = await mediaDetail(option.id, "tv");
  //   if (!isMounted()) return;
  //   setDetail(response);
  // }, []);

  return (
    <Grid
      onMouseEnter={() => setToolTip(true)}
      onMouseLeave={() => setToolTip(false)}
      item
      xs={3}
    >
      <Image
        imageStyle={{ borderRadius: "12px" }}
        style={{
          minHeight: "40vh",
          objectFit: "cover",
          pointer: "cursor",
          borderRadius: "12px",
        }}
        src={getImg(option.poster_path)}
        alt={option.name}
      />
      <div
        style={{
          display: !toolTip && "none",
          relative: "-10vh",
          position: "relative",
          borderBottomLeftRadius: "12px",
          borderBottomRightRadius: "12px",
          top: "-15vh",
          height: "15vh",
          background: "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)",
        }}
      >
        <div
          style={{
            float: "right",
            color: "#FFEDC9",
            position: "relative",
            top: "7.5vh",
            padding: "0 16px",
            width: "100%",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "right",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{option.name}</span>
          <br />
          <span style={{ marginRight: "12px" }}>{renderDate(option)}</span>
          {renderStars(option.vote_average / 2)}
        </div>
      </div>
    </Grid>
  );
};

const sortOptions = (options, property) => {
  //sort by popularity and image availability
  return options
    .filter((option) => option.poster_path)
    .sort((a, b) =>
      a[property] < b[property] ? 1 : b[property] < a[property] ? -1 : 0
    );
};

const Dashboard = () => {
  const history = useHistory();
  const classes = useStyles();
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState("tv");
  const { uid } = useContext(UserContext);

  useEffect(() => {
    if (value) {
      const delayDebounceFn = setTimeout(() => {
        if (value.length >= 3)
          searchMedia(value, mediaType).then((val) => {
            const promises = sortOptions(val, "popularity")
              .slice(0, 4)
              .map((opt) => mediaDetail(opt.id, "tv"));

            Promise.all(promises).then((val) => {
              console.log(val);
              setOptions(val);
            });
          });
      }, 750);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [value]);

  return (
    <div style={{ height: "100vh" }}>
      <Row className={classes.centered}>
        <GoogleAuth />
        <TextField
          style={{ width: "80%" }}
          value={value}
          onChange={(e, val) => {
            setValue(e.target.value);
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

        <Grid style={{ width: "80%", marginTop: "36px" }} container spacing={3}>
          {options.slice(0, 4).map((option, key) => (
            <MediaCard key={key} option={option} />
          ))}

          {options.length === 1 && (
            <Grid
              container
              direction="column"
              item
              spacing={3}
              xs={9}
              style={{ color: "white", paddingLeft: "32px" }}
            >
              <Grid item container align="center">
                <span
                  style={{
                    color: "#FFCD6B",
                    fontWeight: 700,
                    fontSize: "36px",
                  }}
                >
                  {options[0].name}
                </span>
              </Grid>
              <Grid item style={{ marginTop: "-12px" }}>
                <StyledButton
                  text="Add to Watchlist"
                  onClick={() => {
                    console.log("hi");
                  }}
                />
                <span
                  style={{
                    fontSize: "24px",
                    color: "#FFEDC9",
                    marginLeft: "24px",
                  }}
                >
                  {renderDate(options[0])}{" "}
                  {renderStars(options[0].vote_average / 2, "24px")}
                </span>
              </Grid>
              <Grid item>{options[0].overview}</Grid>
            </Grid>
          )}
        </Grid>
      </Row>
    </div>
  );
};

export default Dashboard;
