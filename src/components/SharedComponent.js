import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, Button, Grid, Modal } from "@material-ui/core";
import { StarBorder, Star, StarHalf, AddAlert } from "@material-ui/icons";
import { UserContext } from "../context/UserContext";
import Image from "material-ui-image";
import { getImg } from "../services/movieService";
import lost from "../assets/lost.png";
import { storeShow, removeShow } from "../services/userService";
import { dateFromNow } from "../utils/dateUtil";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import LinesEllipsis from "react-lines-ellipsis";

const useStyles = makeStyles((theme) => ({
  userField: {
    width: "100%",
  },
  modalStyle: {
    position: "absolute",
    top: "10vh",
    width: "60vw",
    left: "20vw",
    borderRadius: "16px",
  },
  baseButton: {
    marginRight: "16px",
    minWidth: "150px",
    padding: "4px 16px",
    backgroundColor: (props) =>
      props.color ? `${props.color} !important` : "#FFCD6B !important",
    borderRadius: "24px",
  },
  outlineButton: {
    marginRight: "16px",
    padding: "4px 16px",
    border: (props) =>
      props.color ? `4px solid ${props.color}` : "4px solid #FFCD6B",
    borderRadius: "24px",
    color: (props) => {
      console.log(props);
      return props.color ? `${props.color}` : "#FFCD6B";
    },
  },
  buttonText: {
    fontWeight: 800,
    fontSize: "24px",
    cursor: "pointer",
  },
  emptyText: {
    fontSize: "18px",
    color: "gray",
  },
  mediaTitleText: {
    color: "#FFCD6B",
    fontWeight: 700,
    fontSize: "36px",
    marginRight: "16px",
    [theme.breakpoints.down("md")]: {
      fontSize: "24px",
    },
  },
  mediaSubtitleText: {
    color: "#FFEDC9",
    fontSize: "24px",
    margin: "auto 16px auto 0",
    [theme.breakpoints.down("md")]: {
      fontSize: "16px",
    },
  },
  mediaBodyText: {
    color: "#c4c4c4",
    fontSize: "20px",
    [theme.breakpoints.down("md")]: {
      fontSize: "16px",
    },
  },
}));

export const TextButton = ({ text, style, onClick, ...props }) => {
  const classes = useStyles();

  return (
    <span
      {...props}
      style={style}
      className={classes.buttonText}
      onClick={onClick}
    >
      {text}{" "}
    </span>
  );
};

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
export const StyledButton = ({
  text,
  onClick,
  outline,
  setColor,
  ...props
}) => {
  const classes = useStyles({ color: setColor });
  return (
    <Button
      className={outline ? classes.outlineButton : classes.baseButton}
      onClick={onClick}
      {...props}
    >
      <span style={{ fontSize: "1rem", fontWeight: outline ? "bold" : 800 }}>
        {text}
      </span>
    </Button>
  );
};

export const renderStars = (val, width) => {
  const roundVal = (Math.round(val * 2) / 2).toFixed(1);
  const floorVal = Math.floor(roundVal);

  var stars = [];
  for (var i = 0; i < floorVal; i++) {
    stars.push(
      <Star key={`fullstar${i}`} style={{ width: width ? width : "16px" }} />
    );
  }
  if (roundVal - floorVal === 0.5)
    stars.push(
      <StarHalf
        key={`halfstar${i}`}
        style={{ width: width ? width : "16px" }}
      />
    );

  for (var j = 0; j < 5 - Math.round(roundVal); j++) {
    stars.push(
      <StarBorder
        key={`nostar${i}`}
        style={{ width: width ? width : "16px" }}
      />
    );
  }
  return stars;
};

export const MediaCard = ({ option, setSelectedOption }) => {
  const [toolTip, setToolTip] = useState(false);
  return (
    <Grid
      onClick={() => {
        setSelectedOption(option);
      }}
      style={{ cursor: "pointer" }}
      onMouseEnter={() => setToolTip(true)}
      onMouseLeave={() => setToolTip(false)}
      item
      xs={6}
      md={3}
    >
      <Image
        imageStyle={{ borderRadius: "12px" }}
        style={{
          objectFit: "cover",
          pointer: "cursor",
          borderRadius: "12px",
          "aspect-ratio": "0.6",
        }}
        src={getImg(option.poster_path)}
        alt={option.name}
      />
      {toolTip && (
        <div
          style={{
            position: "relative",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
            top: "-12vh",
            height: "12vh",
            marginBottom: "-12vh",
            background: "linear-gradient(rgba(0,0,0,0),rgba(0,0,0,1)",
          }}
        >
          <div
            style={{
              float: "right",
              color: "#FFEDC9",
              position: "relative",
              top: "5vh",
              padding: "0 16px",
              marginBottom: "-12vh",
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textAlign: "right",
            }}
          >
            <span style={{ fontWeight: "bold" }}>{option.name}</span>
            <span style={{}}>{` - ${option.number_of_episodes} ep`}</span>
            <br />
            <span style={{ marginRight: "12px" }}>{renderDate(option)}</span>
            {renderStars(option.vote_average / 2)}
          </div>
        </div>
      )}
    </Grid>
  );
};

export const renderDate = (detail) => {
  if (detail) {
    const first = detail.first_air_date;
    const last = detail.last_air_date;
    if ((first && detail.status !== "Ended") || (first && !last))
      return `${first.substring(0, 4)} -`;
    else if (first && last)
      return `${first.substring(0, 4)} - ${last.substring(0, 4)}`;
  } else return "N/A";
};

export const MediaDetail = ({ option, user }) => {
  const classes = useStyles();
  const { shows } = useContext(UserContext);
  const medAndUp = useMediaQuery("(min-width:960px)");
  const exists = shows.find((show) => show.id === option.id);
  const addText = "Add to Watchlist";
  const removeText = "Remove from Watchlist";

  return (
    <>
      {medAndUp && <MediaCard key={option.id} option={option} />}
      <Grid
        container
        direction="column"
        item
        spacing={4}
        md={9}
        xs={12}
        style={{ color: "white", paddingLeft: "32px" }}
      >
        <Grid item container>
          <span className={classes.mediaTitleText}>{option.name}</span>
          <span className={classes.mediaSubtitleText}>
            {renderDate(option)}
            {renderStars(option.vote_average / 2, medAndUp ? "24px" : "16px")}
          </span>
          <span className={classes.mediaSubtitleText}>
            {`${option.number_of_episodes} episodes`}
          </span>
          {/* {option.next_episode_to_air && false && (
            <AddAlert
              onClick={(option) => console.log("PLACEHOLDER NOTIF")}
              style={{
                margin: "auto 12px",
                width: 32,
                height: 32,
                fill: "#FFEDC9",
                cursor: "pointer",
              }}
            />
          )} */}
        </Grid>
        <Grid item style={{ marginTop: "-12px" }}>
          <StyledButton
            text={exists ? removeText : addText}
            onClick={() => {
              if (exists) removeShow(option, user.id);
              else storeShow(option, user.id);
            }}
          />
        </Grid>
        <Grid item>
          <span className={classes.mediaBodyText}>
            {option.overview.length ? (
              <LinesEllipsis text={option.overview} maxLine={6} />
            ) : (
              "Sorry! Unable to fetch show summary."
            )}
          </span>
          <Grid item style={{ paddingTop: "32px" }}>
            <span
              className={classes.mediaSubtitleText}
              style={{
                color: "#FFCD6B",
              }}
            >
              {option.next_episode_to_air &&
                `Episode ${
                  option.next_episode_to_air.episode_number
                } airing ${dateFromNow(option.next_episode_to_air.air_date)}`}
            </span>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export const ModalDetail = ({ option, user, open, setOpen }) => {
  const classes = useStyles();
  return (
    <Modal
      disableEnforceFocus
      disableAutoFocus
      open={open}
      onClose={() => setOpen(false)}
    >
      <div className={classes.modalStyle}>
        <ShowDetail option={option} user={user} />
      </div>
    </Modal>
  );
};

export const ShowDetail = ({ option, user }) => {
  const classes = useStyles();
  const { shows } = useContext(UserContext);

  const exists = shows.find((show) => show.id === option.id);
  return (
    <Grid container>
      <img width="100%" src={getImg(option.backdrop_path)} alt={option.name} />

      <Grid
        container
        direction="column"
        item
        style={{ background: "#282727", color: "white", padding: "32px" }}
      >
        <Grid item container>
          <span
            style={{
              color: "#FFCD6B",
              fontWeight: 700,
              fontSize: "1.5rem",
            }}
          >
            {option.name}
          </span>
          <span
            style={{
              color: "#FFEDC9",
              fontSize: "1.25rem",
              margin: "auto 16px",
            }}
          >{`${option.number_of_episodes} episodes`}</span>
          {option.next_episode_to_air && false && (
            <AddAlert
              onClick={(option) => console.log("PLACEHOLDER NOTIF")}
              style={{
                margin: "auto 12px",
                width: 32,
                height: 32,
                fill: "#FFEDC9",
                cursor: "pointer",
              }}
            />
          )}
          <span
            style={{
              margin: "auto 8px",
              fontSize: "1.25rem",
              color: "#FFEDC9",
            }}
          >
            {renderDate(option)} {renderStars(option.vote_average / 2, "20px")}
          </span>
        </Grid>
        <Grid item style={{ marginTop: "16px" }}>
          {user && (
            <StyledButton
              text={exists ? "Remove from Watchlist" : "Add to Watchlist"}
              onClick={() => {
                if (exists) removeShow(option, user.id);
                else storeShow(option, user.id);
              }}
            />
          )}

          <span
            style={{
              fontSize: "16px",
              color: "#FFCD6B",
              marginLeft: "16px",
            }}
          >
            {option.next_episode_to_air &&
              `Episode ${
                option.next_episode_to_air.episode_number
              } airing ${dateFromNow(option.next_episode_to_air.air_date)}`}
          </span>
        </Grid>
        <Grid item style={{ marginTop: "16px" }}>
          <span style={{ color: "#c4c4c4", fontSize: "18px" }}>
            {`${option.overview.substring(0, 300)}...` ||
              "Sorry! Unable to fetch show summary."}
          </span>
        </Grid>
      </Grid>
    </Grid>
  );
};

const EmptyState = () => {
  const classes = useStyles();
  return (
    <Grid container justify="center" align="center" spacing={3}>
      <Grid item xs={12}>
        <span className={classes.emptyText}>
          Your shows and movies will appear here
          <br />
          once you add them to your watchlist!
        </span>
      </Grid>
      <Grid />
      <div>
        <img alt="lost" src={lost} style={{ width: "25rem" }} />
      </div>
    </Grid>
  );
};

export { EmptyState };
