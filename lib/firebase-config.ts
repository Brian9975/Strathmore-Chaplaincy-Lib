// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqF5fDT2OVj92HK1LZLkBlEeyb4irbn4Q",
  authDomain: "strathmore-chaplaincy-library.firebaseapp.com",
  projectId: "strathmore-chaplaincy-library",
  storageBucket: "strathmore-chaplaincy-library.firebasestorage.app",
  messagingSenderId: "12340744601",
  appId: "1:12340744601:web:1d055bd958d78920204308",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
