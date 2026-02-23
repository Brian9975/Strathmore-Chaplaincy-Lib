import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Admins() {
  const { role, loading} = useAuth()
  const navigate = useNavigate()



  useEffect(() => {
    if (role === "main_admin") {
      navigate("/admins")
    } else if (role === "admin") {
      navigate("/dashboard", {replace: true})
    }

  }, [navigate, role])

  if (loading) {
    return <div>Loading...</div>
  }

 if (role !== "main_admin") {
  return null
 }
 
  return <div className="bg-slate-950 min-h-screen">
    
    <div className="text-right">
      <button className="bg-sky-600 cursor-pointer font-bold text-lg mt-5 mr-5 rounded-lg h-10 w-40">Add Admin</button>
    </div>

  </div>;
}
