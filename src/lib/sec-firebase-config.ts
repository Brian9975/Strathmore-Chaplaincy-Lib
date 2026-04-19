// Import the functions you need from the SDKs you need
import { initializeApp, deleteApp } from "firebase/app";
import { getFirestore, setDoc, doc, serverTimestamp } from "firebase/firestore";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "sonner";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Function to add new admins
let secApp;
export const addNewAdmin = async (
  email: string,
  pass: string,
  name: string,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setAlert: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setLoading(true);
  secApp = initializeApp(firebaseConfig, "SecondaryAppInstance");

  const secDb = getFirestore(secApp);
  const secAuth = getAuth(secApp);

  try {
    const { user } = await createUserWithEmailAndPassword(secAuth, email, pass);

    await setDoc(doc(secDb, "users", user.uid), {
      name: name,
      email: email,
      role: "admin",
      createdAt: serverTimestamp(),
    });

    await signOut(secAuth);
    await deleteApp(secApp);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 6000);
  } catch (error) {
    toast.error(`Error while adding Admin `);
  } finally {
    setLoading(false);
    setOpen(false);
  }
};
