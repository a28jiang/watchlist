import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import { UserContext } from "../context/UserContext";
import { Button, Avatar } from "@material-ui/core";
import { handleLogout, signInWithGoogle } from "../services/userService";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const useStyles = makeStyles((theme) => ({
  navbar: {
    margin: 0,
    flexDirection: "column",
    padding: "8px 16px",
  },
  button: {
    "& span": {
      fontSize: "18px",
      paddingLeft: "12px",
      fontWeight: "bold",
    },
  },
  buttonBar: {
    alignSelf: "flex-end",
    margin: "2% 4%",
  },
  avatarStyle: {
    height: "72px",
    border: "3px solid #FFEDC9",
    width: "72px",
  },
  toggle: {
    border: "none",
    background: "none",
  },
  toggleIcon: {
    float: "right",
    marginTop: "-40px",
    marginLeft: "80px",
  },
}));

const Toggle = ({ open, setOpen, options, children }) => {
  const classes = useStyles();
  return (
    <Dropdown isOpen={open} toggle={() => setOpen(!open)}>
      <DropdownToggle className={classes.toggle}>
        {children}
        <ArrowDropDownIcon
          className={classes.toggleIcon}
          iconStyle={{ width: 60, height: 60 }}
        />
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

export const Navbar = () => {
  const classes = useStyles();
  const user = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // useEffect(() => {
  //   console.log("appuser", user);
  // }, [user]);

  return (
    <Row className={classes.navbar}>
      <div className={classes.buttonBar}>
        {user ? (
          <Toggle
            open={dropdownOpen}
            setOpen={setDropdownOpen}
            options={userOptions}
          >
            <Avatar
              alt={user.displayName}
              src={user.photoURL}
              className={classes.avatarStyle}
            />
          </Toggle>
        ) : (
          <>
            <Button className={classes.button}>
              <span
                style={{ color: "#FFCD6B" }}
                onClick={() => signInWithGoogle()}
              >
                LOGIN
              </span>
            </Button>
            <Button className={classes.button}>
              <span
                style={{ color: "#FFEDC9" }}
                onClick={() => signInWithGoogle()}
              >
                SIGN UP
              </span>
            </Button>
          </>
        )}
      </div>
    </Row>
  );
};
