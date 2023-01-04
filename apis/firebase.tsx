import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcQVKbmEbXi7yS1CyYr-10RQk8InqmWes",
  authDomain: "archive-5dba7.firebaseapp.com",
  projectId: "archive-5dba7",
  storageBucket: "archive-5dba7.appspot.com",
  messagingSenderId: "76207971607",
  appId: "1:76207971607:web:506eee3cd2285a440e2b52",
  measurementId: "G-VTKSL8D4HB",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app);
