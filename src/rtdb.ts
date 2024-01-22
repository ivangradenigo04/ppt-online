import { initializeApp } from "firebase/app";
import * as db from "firebase/database";

initializeApp({
  apiKey: "AIzaSyCnodrITtXKi2UY27ou6sv8wgpnSvM_x2M",
  authDomain: "ppt-online-17bca.firebaseapp.com",
  databaseURL: "https://ppt-online-17bca-default-rtdb.firebaseio.com",
  projectId: "ppt-online-17bca",
  storageBucket: "ppt-online-17bca.appspot.com",
  messagingSenderId: "186944697209",
  appId: "1:186944697209:web:4b34d3db01be26fa8d35a8",
});

const rtdb = db.getDatabase();

export { rtdb, db };
