import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJ-oBHL-OGa_MHPko_MhdhkVYudrUoYVw",
  authDomain: "fir-4da43.firebaseapp.com",
  projectId: "fir-4da43",
  storageBucket: "fir-4da43.appspot.com",
  messagingSenderId: "490495377270",
  appId: "1:490495377270:web:47909b003dd537a25dc457",
  measurementId: "G-4K44FV3B29",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
//to use these outside of file
export { db, auth };
