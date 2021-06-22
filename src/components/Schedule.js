import React, { useState, useEffect, useContext, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Paper, Modal } from "@material-ui/core";
import { getImg } from "../services/movieService";
import networkImg from "../assets/watchlist_network.png";
import { UserContext } from "../context/UserContext";
import { TextButton, ModalDetail } from "../components/SharedComponent";
// import Popover from "@material-ui/core/Popover";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "2px solid #7B7B7B",
    borderRadius: "24px",
    padding: "36px 24px",
    width: "80%",
  },
  subtitle: {
    fontWeight: 800,
    fontSize: "22px",
    cursor: "pointer",
  },
  timeLinePic: {
    position: "absolute",
    left: (props) => `${props.position * 60 + 25}%`,
    marginTop: -32,
  },
  collectionPic: {
    margin: "12px",
    display: "inline-block",
  },
  imgStyle: {
    borderRadius: "50%",
    objectFit: "cover",
    "&:hover": {
      boxShadow: "0 5px 20px rgba(145, 92, 182, 0.8)",
    },
  },
  modalStyle: {
    position: "absolute",
    top: "10vh",
    width: "60vw",
    left: "20vw",
    borderRadius: "16px",
  },
}));

const ShowPortrait = ({ show, position, user }) => {
  const classes = useStyles({ position });
  const [open, setOpen] = useState(false);
  const [toolTip, setToolTip] = useState(false);
  return (
    <>
      <div
        style={{ cursor: "pointer", zIndex: 5 }}
        onClick={() => setOpen(true)}
        className={position ? classes.timeLinePic : classes.collectionPic}
        onMouseEnter={() => setToolTip(true)}
        onMouseLeave={() => setToolTip(false)}
      >
        <img
          className={classes.imgStyle}
          alt="show"
          src={getImg(show.poster_path)}
          height="64"
          width="64"
        />
        {toolTip && position && (
          <div style={{ position: "relative", top: 8, left: -12 }}>
            <span style={{ fontWeight: "bold" }}>
              {show.next_episode_to_air.air_date}
            </span>
          </div>
        )}
      </div>
      <Modal disableEnforceFocus open={open} onClose={() => setOpen(false)}>
        <div className={classes.modalStyle}>
          <ModalDetail option={show} user={user} />
        </div>
      </Modal>
    </>
  );
};

const TimeLineBar = () => (
  <div
    style={{
      height: "8px",
      borderRadius: "24px",
      background: "linear-gradient(to right, #c4c4c4, rgba(196,196,196,0))",
    }}
  />
);

const TIME_OPTIONS = {
  "3D": {
    val: 86400000 * 3.5,
    labels: ["now", "○", "1D", "○", "2D", "○", "3D", "Upcoming"],
  },
  "1W": {
    val: 86400000 * 7,
    labels: ["now", "1D", "2D", "3D", "4D", "5D", "6D", "Upcoming"],
  },
  "1M": {
    val: 86400000 * 7 * 4,
    labels: ["now", "○", "1W", "○", "2W", "○", "3W", "Upcoming"],
  },
};

const Schedule = () => {
  const { user } = useContext(UserContext);
  const classes = useStyles();
  const [timeOpt, setTimeOpt] = useState("1W");
  const { shows } = useContext(UserContext);
  const containerRef = useRef(null);

  const groupByNetwork = (shows) => {
    if (!shows.length) return;
    const finalData = [
      {
        logo: networkImg,
        name: "Other",
        timeline: true,
        shows: [],
      },
      {
        text: "Upcoming",
        name: "noNext",
        shows: [],
      },
    ];

    shows.forEach((show) => {
      if (show.status === "Returning Series") {
        if (show.next_episode_to_air) {
          const position =
            (Date.parse(show.next_episode_to_air.air_date) - Date.now()) /
            TIME_OPTIONS[timeOpt].val;
          if (position * 60 + 25 < 84) {
            finalData[0].shows.push({
              position,
              ...show,
            });
          } else {
            finalData[1].shows.push(show);
          }
        } else {
          finalData[1].shows.push(show);
        }
      }
    });

    return finalData;
  };
  const showData = groupByNetwork(shows) || [];
  return (
    <>
      <Grid
        style={{ width: "80%", margin: "auto" }}
        container
        item
        justify="flex-end"
      >
        <Grid item style={{ marginBottom: "36px" }}>
          {Object.keys(TIME_OPTIONS).map((key) => (
            <TextButton
              style={{
                padding: "12px",
                color: key === timeOpt ? "#FFEDC9" : "#FFCD6B",
              }}
              text={key}
              onClick={() => setTimeOpt(key)}
            />
          ))}
        </Grid>
      </Grid>
      <Grid
        className={classes.container}
        container
        item
        spacing={4}
        ref={containerRef}
      >
        <div style={{ width: "100%", marginBottom: "24px" }}>
          <div style={{ width: "85%", float: "right" }}>
            {TIME_OPTIONS[timeOpt].labels.map((label, index) => (
              <div
                key={index}
                style={{
                  width: `${100 / TIME_OPTIONS[timeOpt].labels.length}%`,
                  display: "inline-block",
                  textAlign: "center",
                }}
              >
                {label === "now" ? (
                  <PlayCircleFilledIcon style={{ color: "white" }} />
                ) : (
                  <>
                    <span style={{ color: "white", fontWeight: "bold" }}>
                      {label}
                    </span>
                    <div
                      style={{
                        margin: "12px auto",
                        marginBottom: `-80px`,
                        position: "relative",
                        backgroundColor: "#696969",
                        height: `75px`,
                        width: "1px",
                      }}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {showData.map((network) => (
          <Grid
            item
            container
            key={network.name}
            style={{ color: "white", margin: "24px 0" }}
          >
            <Grid
              container
              item
              style={{ height: "50px" }}
              alignContent="center"
            >
              <Grid container item xs={2} alignContent="center">
                {network.logo && (
                  <img alt="show" src={network.logo} width="80%" />
                )}
                {network.text && (
                  <span
                    className={classes.subtitle}
                    style={{ color: "#FFCD6B", padding: "12px" }}
                  >
                    {network.text}
                  </span>
                )}
              </Grid>
              <Grid item xs={10} style={{ margin: "auto" }}>
                {network.timeline && <TimeLineBar />}
                <Grid container alignContent="center" style={{ width: "100%" }}>
                  {network.shows.map((show) => (
                    <ShowPortrait
                      user={user}
                      key={show.name}
                      show={show}
                      position={show.position}
                    />
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export { Schedule };
