import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, Timestamp} from "firebase/firestore";
import { db } from "../../lib/firebase-config";
import type { UserRole } from "../../types/userRole";


interface UserInfo {
  name: string,
  email: string,
  role: UserRole,
  createdAt: Timestamp,
}
export default function Admins() {
  const { role, loading } = useAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<UserInfo[]>([])
  
  useEffect(() => {
    const AdminCollectionRef = collection(db, "users")
   const unsubscribe = onSnapshot(AdminCollectionRef, (snap) => {
     setAdmins(snap.docs.map(doc => ({ id: doc.id, ...doc.data() as UserInfo})))
   })
   return () => unsubscribe()
  }, []);



  useEffect(() => {
    if (role === "main_admin") {
      navigate("/admins");   
    } else if (role === "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, role]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (role !== "main_admin") {
    return null;
  }

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="text-right">
        <button className="bg-sky-600 cursor-pointer font-bold text-lg mt-5 mr-5 rounded-lg h-10 w-40">
          Add Admin
        </button>
      </div>
      <div>{admins.map(user => {
         return <div><h1 className="text-white">{user.email}</h1>
                   <h1 className="text-white">{user.role === "main_admin" ? "main admin" : "admin"}</h1>
                   <p className="text-white">{user.name}</p>
                   <p className="text-white">{user.createdAt.toDate().toLocaleString("en-Us", { dateStyle: "medium", timeStyle: "short"})}</p>
        
         </div>
      } 
      )}</div>

    </div>
  );
}
