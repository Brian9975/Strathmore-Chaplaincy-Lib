import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase-config";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "@/components/ui/spinner"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import StrathLogo1 from "@/img/StrathLogo.png"
export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { loading, user, setLoading } = useAuth()
  
  const logAdminIn = async (e: any) => {
    e.preventDefault()
    if (!email) {
      alert("Please Fill The Email Field")
    }  else if (!password) {
      alert("Please Include The Password")
    }

    else{
      setLoading(true)
    try{
     
        await signInWithEmailAndPassword(auth, email, password)
        navigate("/dashboard")

    } catch (error: any) {
      alert(error.code)
    } finally{
      setLoading(false)
    }
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


           <div className="flex items-center flex-col justify-center">
            <img width={200} className="text-slate-50" src={StrathLogo1} alt="strathmore logo" />
            <div>
             <h1 className="text-slate-100 text-2xl">Chaplaincy Library System</h1>
            </div>
            
           </div>

                   <FieldGroup>
                       <Field>
                        <Label className="text-slate-50" htmlFor="email">Email</Label>
                        <Input id="email" className="text-slate-50 " value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" placeholder="Email" />
                      </Field>
                      <Field>
                        <Label className="text-slate-50" htmlFor="password">Password</Label>
                        <Input id="password" className="text-slate-50" value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" placeholder=" Password"/>
                      </Field>
                    </FieldGroup>
         <Button type="submit" variant="default" className="bg-slate-700 h-10 rounded-lg cursor-pointer font-semibold w-30 text-slate-50">Login</Button>
        </form>
      </div>
    </>
  );
}
