// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJuDvhf4EEOjJG3weEBvsGkw4nzkXFtac",
  authDomain: "g04recurrent.firebaseapp.com",
  projectId: "g04recurrent",
  storageBucket: "g04recurrent.appspot.com",
  messagingSenderId: "882869436488",
  appId: "1:882869436488:web:75cf96b656aa56c569d87d",
  measurementId: "G-9H9EY40T5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics }