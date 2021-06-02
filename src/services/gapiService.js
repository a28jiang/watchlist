import React, { useEffect, useState } from "react";
import { storeCalendarId } from "./userService";
import gapi from "gapi-client";

const CLIENT_ID = process.env.REACT_APP_gapiClientID;
const API_KEY = process.env.REACT_APP_gapiApiKey;
const SCOPES = "https://www.googleapis.com/auth/calendar.app.created";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];

const GoogleAuth = () => {
  const [isSignedIn, setIsSignedIn] = useState(null);

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          clientId: CLIENT_ID,
          scope: SCOPES,
        })
        .then(() => {
          gapi.client.load("calendar", "v3", () =>
            console.log("loaded calendar")
          );
          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
        });
    });
  }, []);

  const ensureSignedIn = async () => {
    if (!isSignedIn) {
      await gapi.auth2.getAuthInstance().signIn();
    }
    return true;
  };

  const createCalendar = async (uid) => {
    const signIn = await ensureSignedIn();
    if (signIn) {
      gapi.client.calendar.calendars
        .insert({
          summary: "Watchlist",
        })
        .then((val) => {
          const calendarId = val.result.id;
          storeCalendarId(uid, calendarId);
        });
    }
  };

  const createEvent = async ({
    summary,
    description,
    startDate,
    calendarId,
  }) => {
    const signIn = await ensureSignedIn();
    if (signIn) {
      const newEvent = {
        summary: summary,
        description: description,
        start: { date: startDate },
        end: { date: startDate },
      };

      gapi.client.calendar.events
        .insert({
          calendarId: calendarId,
          resource: newEvent,
        })
        .then((val) => console.log(val));
    }
  };

  const signOut = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      auth2.disconnect().then((val) => console.log(val));
    });
  };
  const renderAuthButton = () => {
    if (isSignedIn === null) {
      return <div>I don't know if we are signed in</div>;
    } else if (isSignedIn) {
      return <div>I am signed in!</div>;
    } else {
      return <div>I am not signed in</div>;
    }
  };

  return (
    <div>
      <button onClick={() => createCalendar("kdWCM5H9vVb6KTfPdgtxvuf8oeJ2")}>
        CREATEcalendar
      </button>
      <button
        onClick={() =>
          createEvent({
            summary: "TEST",
            description: "YES",
            startDate: "2021-05-31",
          })
        }
      >
        CREATEdate
      </button>
      <button onClick={() => signOut()}>SIGNOUT</button>
      {renderAuthButton()}
    </div>
  );
};

export { GoogleAuth };
