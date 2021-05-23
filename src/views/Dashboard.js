import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { Button, CircularProgress, TextField, Grid } from "@material-ui/core";
import Image from "material-ui-image";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getTrending, searchMedia, getImg } from "../services/movieService";
import { renderStars, StyledTextField } from "../components/SharedComponent";
import { SettingsOutlined } from "@material-ui/icons";

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

const SearchListItem = ({ option }) => {
  <Grid container spacing={3}>
    <Grid justify="center" item xs={1}>
      <Image
        imageStyle={{ borderRadius: "50%" }}
        style={{
          height: "42px",
          width: "42px",
        }}
        src={getImg(option.poster_path)}
        alt={option.name}
      />
    </Grid>
    <Grid justify="flex-start" item container xs={11}>
      <Grid item xs={12}>
        {option.name}
      </Grid>
      <Grid item xs={12}>
        <span style={{ marginRight: "16px" }}>
          {option.first_air_date || "N/A"}
        </span>
        {renderStars(option.vote_average / 2)}
      </Grid>
    </Grid>
  </Grid>;
};

const AddMediaModal = () => {};

const Dashboard = () => {
  const history = useHistory();
  const classes = useStyles();
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState("tv");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (value.length >= 3)
        searchMedia(value, mediaType).then((val) => {
          setOptions(val);
        });
    }, 750);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  // const searchDB = (query) => {
  //   if (query.length >= 3 && !loading) {
  //     setLoading(true);
  //     setTimeout(() => {
  //       searchTV(query).then((val) => {
  //         console.log(val);
  //         setOptions(val);
  //       });
  //       setLoading(false);
  //     }, 750);
  //   }
  // };

  return (
    <div style={{ height: "100vh" }}>
      <Row className={classes.centered}>
        <Autocomplete
          style={{
            width: "80%",
            padding: "12px 16px",
            backgroundColor: "white",
            borderRadius: "32px",
          }}
          noOptionsText={"Search to start tracking your favourite shows"}
          onBlur={() => setOptions([])}
          options={options}
          getOptionLabel={(option) => option.name}
          renderOption={(option) => <SearchListItem option={option} />}
          autoComplete
          includeInputInList
          onInputChange={(e, val) => setValue(val)}
          renderInput={(params) => (
            <TextField
              value={value}
              {...params}
              InputProps={{
                ...params.InputProps,
                disableUnderline: true,

                style: { fontSize: "18px" },
              }}
              placeholder="Find a series (e.g. Attack on Titan)"
            />
          )}
        />
      </Row>
    </div>
  );
};

export default Dashboard;
