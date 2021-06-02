import { auth, db } from "../firebase";
import firebase from "firebase/app";
import { UserContext } from "../context/UserContext";

const provider = new firebase.auth.GoogleAuthProvider();

const handleLogout = async () => {
  try {
    await auth.signOut();
  } catch {
    console.log("Failed to log out");
  }
};

const signInWithGoogle = async () => {
  //Added the isNewUser property to firebase.auth.AdditionalUserInfo
  await auth.signInWithPopup(provider).then((user) => {
    const obj = user.user;
    return db.collection("users").doc(obj.uid).set({
      name: obj.displayName,
      email: obj.email,
      photo: obj.photoURL,
      type: "basic",
    });
  });
};

const storeCalendarId = async (uid, calendarId) => {
  const usersRef = db.collection("users").doc(uid);

  usersRef.get().then((doc) => {
    if (doc.exists) {
      usersRef.update({ calendarId: calendarId });

      return true;
    }
    return false;
  });
};

const getUserInfo = async (uid) => {
  const usersRef = db.collection("users").doc(uid);

  usersRef.get().then((doc) => {
    if (doc.exists) {
      console.log(doc.data());
    }
  });
};

export { handleLogout, signInWithGoogle, storeCalendarId, getUserInfo };
