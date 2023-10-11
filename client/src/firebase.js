// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD1Y4SxBfoW-MCzcU_mWyvVjR8p8ehMOU",
  authDomain: "mernestate-f111d.firebaseapp.com",
  projectId: "mernestate-f111d",
  storageBucket: "mernestate-f111d.appspot.com",
  messagingSenderId: "517828821105",
  appId: "1:517828821105:web:ab5dd3d9cbbdf8ecdd5bd0",
  measurementId: "G-5JMSCR6Z0E"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);