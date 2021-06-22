import { auth, db } from "../firebase";
import firebase from "firebase/app";
import { mediaDetail } from "./movieService";

const provider = new firebase.auth.GoogleAuthProvider();

const handleLogout = async () => {
  try {
    await auth.signOut();
  } catch {
    console.log("Failed to log out");
  }
};

const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {
    auth
      .signInWithPopup(provider)
      .then((user) => {
        const obj = user.user;
        const usersRef = db.collection("users").doc(obj.uid);

        usersRef.get().then((res) => {
          if (!res.exists) {
            //create new user if doesn't exist
            const setUser = {
              id: obj.uid,
              name: obj.displayName,
              email: obj.email,
              photo: obj.photoURL,
            };
            usersRef.set(setUser);
          }
          resolve(true);
        });
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

const storeShow = (show, uid) => {
  return new Promise((resolve, reject) => {
    if (!show.id) reject({ reason: "Show ID not provided" });

    const showRef = db
      .collection("users")
      .doc(uid)
      .collection("shows")
      .doc(show.id.toString());

    showRef
      .get()
      .then((res) => {
        if (!res.exists) {
          showRef.set({ status: show.status });
          resolve(true);
        }
        reject({ reason: "Show already exists" });
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

const removeShow = (show, uid) => {
  return new Promise((resolve, reject) => {
    if (!show.id) reject({ reason: "Show ID not provided" });

    const showRef = db
      .collection("users")
      .doc(uid)
      .collection("shows")
      .doc(show.id.toString());

    showRef
      .get()
      .then((res) => {
        if (res.exists) {
          showRef.delete();
          resolve(true);
        }
        reject({ reason: "Show does not exist" });
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};

const getShows = async (uid, setShows) => {
  db.collection("users")
    .doc(uid)
    .collection("shows")
    .onSnapshot((doc) => {
      const promises = doc.docs.map((show) => mediaDetail(show.id, "tv"));

      Promise.all(promises).then((val) => {
        setShows(val);
      });
    });
};

const getUser = async (uid, setUser) => {
  if (uid) {
    db.collection("users")
      .doc(uid)
      .onSnapshot((doc) => {
        console.log("setting user", doc.data());
        setUser(doc.data());
      });
  }
};

export {
  handleLogout,
  signInWithGoogle,
  getUser,
  storeShow,
  removeShow,
  getShows,
};
