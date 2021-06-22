import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { UserContext } from "../context/UserContext";
import { Button, Avatar, Grid } from "@material-ui/core";
import { handleLogout, signInWithGoogle } from "../services/userService";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles((theme) => ({
  navbar: {
    margin: "auto",
    padding: "16px",
    width: "80%",
  },
  button: {
    "& span": {
      fontSize: "18px",
      paddingLeft: "12px",
      fontWeight: "bold",
    },
  },
  avatarStyle: {
    height: "64px",
    border: "2px solid #FFEDC9",
    width: "64px",
  },
  toggle: {
    border: "none",
    background: "none",
  },
  toggleIcon: {
    float: "right",
    marginTop: "-40px",
    marginLeft: "70px",
  },
  header: {
    fontFamily: "typeface-playfair-display",
    fontWeight: "bold",
    color: "#FFEDC9",
    cursor: "pointer",
    fontSize: "3vw",
  },
}));

const Toggle = ({ open, setOpen, options, children }) => {
  const classes = useStyles();
  return (
    <Dropdown isOpen={open} toggle={() => setOpen(!open)}>
      <DropdownToggle className={classes.toggle}>
        {children}
        <ArrowDropDownIcon className={classes.toggleIcon} />
      </DropdownToggle>
      <DropdownMenu>
        {options.map((item) => (
          <DropdownItem onClick={() => item.callback()}>
            {item.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

const userOptions = [{ name: "Logout", callback: () => handleLogout() }];

export const Navbar = ({ landing }) => {
  const classes = useStyles();
  const history = useHistory();
  const { user } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const signIn = () => {
    signInWithGoogle().then((val) => {
      console.log(val);
      if (val) {
        history.push("/dashboard");
      }
    });
  };
  return (
    <Grid container className={classes.navbar} xs={12}>
      <Grid item xs={6}>
        {history.location.pathname !== "/" && (
          <span className={classes.header}>
            watch<span style={{ color: "#FFCD6B" }}>list.</span>
          </span>
        )}
      </Grid>
      <Grid container item justify="flex-end" xs={6}>
        {user ? (
          <Toggle
            open={dropdownOpen}
            setOpen={setDropdownOpen}
            options={userOptions}
          >
            <Avatar
              alt={user.name}
              src={user.photo}
              className={classes.avatarStyle}
            />
          </Toggle>
        ) : (
          <>
            <Button className={classes.button}>
              <span style={{ color: "#FFCD6B" }} onClick={() => signIn()}>
                LOGIN
              </span>
            </Button>
            <Button className={classes.button}>
              <span style={{ color: "#FFEDC9" }} onClick={() => signIn()}>
                SIGN UP
              </span>
            </Button>
          </>
        )}
      </Grid>
    </Grid>
  );
};
