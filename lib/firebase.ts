// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAzViUlvkH4p6-rBRQZK2CBABHFpL2Y-E",
  authDomain: "codexpert-447a6.firebaseapp.com",
  databaseURL: "https://codexpert-447a6-default-rtdb.firebaseio.com",
  projectId: "codexpert-447a6",
  storageBucket: "codexpert-447a6.appspot.com",
  messagingSenderId: "721355280522",
  appId: "1:721355280522:web:ae1d02ecf1b51afbbecce0",
};

const app = initializeApp(firebaseConfig);

// export Firestore or Auth if needed later
export const db = getDatabase(app);