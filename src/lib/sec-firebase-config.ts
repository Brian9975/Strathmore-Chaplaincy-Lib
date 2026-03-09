// Import the functions you need from the SDKs you need
import { initializeApp, deleteApp } from "firebase/app";
import { getFirestore, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { getAuth, signOut, createUserWithEmailAndPassword } from "firebase/auth";
import type { UserInfo } from "@/types/userInfo";
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

// Function to add new admins
let secApp;
 export const addNewAdmin = async (email: string, pass:string, name: string, setOpen: React.Dispatch<React.SetStateAction<boolean>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setAlert: React.Dispatch<React.SetStateAction<boolean>>, admins: UserInfo[]) => {

    secApp = initializeApp(firebaseConfig, "SecondaryAppInstance");

 const secDb = getFirestore(secApp);
 const secAuth = getAuth(secApp);

  try {

    if (!email) {
    alert("Kindly Fill The Email Field")
   } else if (!pass) {
    alert("Kindly Fill the Password")
   } else if (!name) {
    alert("Kindly Fill The Name Field")
   } else {
    
   setLoading(true)
    const { user } = await createUserWithEmailAndPassword(secAuth, email, pass)
    
    await setDoc(doc(secDb, "users", user.uid), {
      name: name,
      email: email,
      role: "admin",
      createdAt: serverTimestamp()
    })
    
    
    await signOut(secAuth)
    await deleteApp(secApp)
    setAlert(true)
    setTimeout(() => {
      setAlert(false)
    }, 6000)
  }
    
  } catch (error) {
 console.log(error)
  } finally {
    setLoading(false)
    setOpen(false)
  }
}