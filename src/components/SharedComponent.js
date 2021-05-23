import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, Button } from "@material-ui/core";
import StarIcon from "@material-ui/icons/Star";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import StarHalfIcon from "@material-ui/icons/StarHalf";

const useStyles = makeStyles((theme) => ({
  userField: {
    width: "100%",
  },
  baseButton: {
    marginRight: "16px",
    minWidth: "150px",
    padding: "4px 16px",
    backgroundColor: "#FFCD6B !important",
    borderRadius: "24px",
  },
  outlineButton: {
    marginRight: "16px",
    padding: "4px 16px",
    border: "4px solid #FFCD6B",
    borderRadius: "24px",
    color: "#FFCD6B",
  },
  buttonText: {
    fontWeight: 800,
    fontSize: "24px",
  },
}));

export const StyledTextField = ({
  value,
  setValue,
  placeholder,
  ...params
}) => {
  const classes = useStyles();
  return (
    <InputBase
      {...params}
      className={classes.userField}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      inputProps={{
        style: {
          padding: "12px 16px",
          backgroundColor: "white",
          borderRadius: "16px",
        },
      }}
    />
  );
};
export const StyledButton = ({ text, onClick, placeholder, outline }) => {
  const classes = useStyles();
  return (
    <Button
      className={outline ? classes.outlineButton : classes.baseButton}
      onClick={onClick}
    >
      <span style={{ fontSize: "1rem", fontWeight: outline ? "bold" : 800 }}>
        {text}
      </span>
    </Button>
  );
};

export const renderStars = (val) => {
  const floorVal = Math.floor(val);
  const halfVal = Math.round(val - floorVal);
  var stars = [];
  for (var i = 0; i < floorVal; i++) {
    stars.push(<StarIcon style={{ width: "16px" }} />);
  }
  if (halfVal) stars.push(<StarIcon style={{ width: "16px" }} />);

  for (var j = 0; j < 5 - (floorVal + halfVal); j++) {
    stars.push(<StarBorderIcon style={{ width: "16px" }} />);
  }
  return stars;
};
