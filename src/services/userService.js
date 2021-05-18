import { auth, db } from "../firebase";
import firebase from "firebase/app";

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

export { handleLogout, signInWithGoogle };
