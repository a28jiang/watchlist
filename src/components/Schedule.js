import React, { useState, useContext, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Modal,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  TableCell,
} from "@material-ui/core";
import { getImg } from "../services/movieService";
import networkImg from "../assets/watchlist_network.png";
import { UserContext } from "../context/UserContext";
import {
  TextButton,
  ModalDetail,
  EmptyState,
} from "../components/SharedComponent";
// import Popover from "@material-ui/core/Popover";
import {
  List,
  Schedule as ScheduleIcon,
  PlayCircleFilled,
} from "@material-ui/icons";

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
    "&:hover": {
      transform: "translate(0, -10px)",
      zIndex: "99",
      "transition-timing-function": "ease-out",
      transition: "0.3s",
    },
  },
  collectionPic: {
    margin: "12px",
    display: "inline-block",
    "&:hover": {
      transform: "translate(0, -10px)",
      zIndex: "99",
      "transition-timing-function": "ease-out",
      transition: "0.3s",
    },
  },
  imgStyle: {
    borderRadius: "50%",
    objectFit: "cover",
    "&:hover": {
      transition: "0.3s",
      boxShadow: "0 5px 20px rgba(182, 137, 92, 0.8)",
    },
  },
  modalStyle: {
    position: "absolute",
    top: "10vh",
    width: "60vw",
    left: "20vw",
    borderRadius: "16px",
  },
  iconStyle: {
    color: "#FFEDC9",
    fontSize: "2.5rem",
    margin: "auto 12px",
    cursor: "pointer",
  },
}));
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
    val: 86400000 * 7 * 3.5,
    labels: ["now", "○", "1W", "○", "2W", "○", "3W", "Upcoming"],
  },
  "3M": {
    val: 86400000 * 7 * 4 * 3,
    labels: ["now", "○", "1M", "○", "2M", "○", "3M", "Upcoming"],
  },
};

const COLUMNS = [
  { field: "name", headerName: "Name" },
  { field: "number_of_episodes", headerName: "Episodes" },
  { field: "airDate", headerName: "Next Episode Airing" },
  { field: "status", headerName: "Status" },
];
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
      <Modal
        disableEnforceFocus
        disableAutoFocus
        open={open}
        onClose={() => setOpen(false)}
      >
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

const DataTable = ({ shows }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {COLUMNS.map((col) => (
              <TableCell style={{ color: "#FFEDC9" }}>
                {col.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {shows.flat().map((row) => (
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell style={{ color: "#FFEDC9" }}>
                  {row[col.field]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Schedule = () => {
  const { user } = useContext(UserContext);
  const classes = useStyles();
  const [timeOpt, setTimeOpt] = useState("1W");
  const { shows } = useContext(UserContext);
  const containerRef = useRef(null);
  const [scheduleView, setScheduleView] = useState(true);

  const formatScheduleData = (shows) => {
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
      {
        text: "Completed Series",
        name: "completed",
        shows: [],
      },
    ];

    shows.forEach((show) => {
      if (show.status === "Ongoing") {
        const position =
          (Date.parse(show.next_episode_to_air.air_date) - Date.now()) /
          TIME_OPTIONS[timeOpt].val;

        if (position > 0 && position * 60 + 25 < 85) {
          finalData[0].shows.push({
            position,
            ...show,
          });
        } else {
          finalData[1].shows.push(show);
        }
      } else if (show.status === "Returning Series") {
        finalData[1].shows.push(show);
      } else {
        finalData[2].shows.push(show);
      }
    });

    return finalData;
  };

  const formatData = (shows) => {
    return shows.map((show) => {
      return {
        ...show,
        status: show.next_episode_to_air ? "Ongoing" : show.status,
        airDate: show.next_episode_to_air
          ? show.next_episode_to_air.air_date
          : "N/A",
      };
    });
  };
  const tableData = formatData(shows) || [];
  const scheduleData = formatScheduleData(tableData) || [];

  if (shows.length)
    return (
      <>
        <Grid
          style={{ width: "80%", margin: "0 auto 36px auto" }}
          container
          item
        >
          <Grid container item justify="flex-end">
            {scheduleView &&
              Object.keys(TIME_OPTIONS).map((key) => (
                <TextButton
                  style={{
                    padding: "12px",
                    color: key === timeOpt ? "#FFEDC9" : "#FFCD6B",
                  }}
                  text={key}
                  onClick={() => setTimeOpt(key)}
                />
              ))}
            {scheduleView ? (
              <>
                <List
                  className={classes.iconStyle}
                  onClick={() => setScheduleView(false)}
                />
              </>
            ) : (
              <ScheduleIcon
                className={classes.iconStyle}
                onClick={() => setScheduleView(true)}
              />
            )}
          </Grid>
        </Grid>
        <Grid
          className={classes.container}
          container
          item
          spacing={4}
          ref={containerRef}
        >
          {scheduleView ? (
            <>
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
                        <PlayCircleFilled style={{ color: "white" }} />
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
              {scheduleData.map((network) => (
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
                      <Grid
                        container
                        alignContent="center"
                        style={{ width: "100%" }}
                      >
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
            </>
          ) : (
            <Grid style={{ minHeight: "35vh", width: "100%" }}>
              <DataTable shows={tableData} />
            </Grid>
          )}
        </Grid>
      </>
    );
  else
    return (
      <Grid
        style={{ marginTop: "64px", height: "35vh" }}
        className={classes.container}
        container
        alignItems="center"
        item
        spacing={4}
        ref={containerRef}
      >
        <EmptyState />;
      </Grid>
    );
};

export { Schedule };
