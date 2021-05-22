import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { Button, CircularProgress, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getTrending, searchMovie, searchTV } from "../services/movieService";
import { StyledTextField } from "../components/SharedComponent";

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
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const searchDB = (query) => {
    console.log(query, loading);
    if (query.length >= 3) {
      setLoading(true);
      let results;

      setTimeout(() => {
        searchTV(query).then((val) => setOptions(val));
        setLoading(false);
      }, 750);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <Row className={classes.centered}>
        <Autocomplete
          style={{
            width: "80%",
            padding: "8px 16px",
            backgroundColor: "white",
            borderRadius: "24px",
          }}
          options={options}
          getOptionLabel={(option) => option.name}
          autoComplete
          includeInputInList
          onInputChange={(e, val) => searchDB(val)}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{ ...params.InputProps, disableUnderline: true }}
              placeholder="Start tracking your favourite series"
            />
          )}
        />
      </Row>
    </div>
  );
};

export default Dashboard;
