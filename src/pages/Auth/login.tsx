import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase-config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "@/components/ui/spinner"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { loading, user } = useAuth()
  
  const logAdminIn = async (e: any) => {
    e.preventDefault()

    try{
        await signInWithEmailAndPassword(auth, email, password)
        navigate("/dashboard")

    } catch (error: any) {
      alert(error.code)
    }
   
  }

useEffect(() => {
if (user && loading) {
  navigate("/dashboard")
}
}, [navigate, user, loading])

if (loading) {
  return <div className="flex min-h-screen justify-center items-center bg-slate-900">
      <Spinner className="text-3xl text-slate-50"/>
    </div>;
}

if (user) {
  return null
}
  return (
    <>
      <div className="bg-slate-950 min-h-screen justify-center flex items-center">
       
        <form onSubmit={logAdminIn} className="flex flex-col items-center gap-5">
           <div>
          <h1 className="text-slate-100 text-3xl">Chaplaincy Library System</h1>
        </div> 
          <div>
            <input onChange={e => setEmail(e.target.value)} type="email" className="border outline-none h-10 w-75 pl-1 text-slate-100 text-lg border-slate-300 placeholder-slate-700 rounded" placeholder="email"/>
          </div>
          <div>
            <input onChange={e => setPassword(e.target.value)} type="password" className="border-slate-300 outline-none h-10 w-75 pl-1 text-slate-100 text-lg border placeholder-slate-700 rounded" placeholder="password"/>
          </div>
         <button type="submit" className="bg-cyan-600 h-10 rounded-lg cursor-pointer font-semibold w-30 text-slate-950">Login</button>
        </form>
      </div>
    </>
  );
}
