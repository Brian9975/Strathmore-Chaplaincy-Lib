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
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleX } from "lucide-react";
import useBrandTheme from "@/hooks/useBrandTheme";
export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [alertError, setAlertError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()
  const { loading, user, setLoading } = useAuth()
  const {brandThemes} = useBrandTheme()
  const logAdminIn = async (e: any) => {
    e.preventDefault()
    
    
    const handleLoginError = (message: string) => {
        setAlertError(true)
      setTimeout(() => {
       setAlertError(false)
      }, 6000)
      setErrorMessage(message)

  }


    if (!email) {
      toast.warning("Please Fill The Email Field", {position: "top-center"})
    }  else if (!password) {
      toast.warning("Please Include The Password", {position: "top-center"})
    }

    else{
      setLoading(true)
    try{
     
        await signInWithEmailAndPassword(auth, email, password)
        navigate("/dashboard")
    } catch (error: any) {
      console.log(error.code)
     handleLoginError(error.code)
     
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
    return (
      <div className={`flex min-h-screen bg-[${brandThemes["primary-light"]}] dark:bg-primary-background justify-center items-center`} >
        <Spinner className={`text-3xl text-[${brandThemes["sec-light"]}] dark:text-secondary-text`} />
      </div>
    );
  }

if (user) {
  return null
}
  return (
    <>
      <div className={`bg-[${brandThemes["primary-light"]}] dark:bg-primary-background min-h-screen justify-center flex items-center`}>
       
        <form onSubmit={logAdminIn} className="flex flex-col items-center gap-5">


           <div className="flex items-center flex-col justify-center">
            <img width={200}  src={StrathLogo1} alt="strathmore logo" />
            <div>
             <h1 className="text-2xl">Chaplaincy Library System</h1>
            </div>
            
           </div>

                   <FieldGroup>
                       <Field>
                        <Label className="" htmlFor="email">Email</Label>
                        <Input id="email" className="" value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" placeholder="Email" />
                      </Field>
                      <Field>
                        <Label className="" htmlFor="password">Password</Label>
                        <Input id="password" className="" value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" placeholder=" Password"/>
                      </Field>
                    </FieldGroup>
         <Button type="submit" variant="default" className="h-10 rounded-lg cursor-pointer font-semibold w-30">Login</Button>
        </form>
      </div>

            <div className="fixed -translate-x-1/2 left-1/2 top-2">
              
              { alertError && (
                <Alert className="max-w-md">
                  <CircleX size={5} color="red"/> 
                  <AlertTitle
                   className="text-md text-error">
                   An error occured while logging in! 
                  </AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
             
            </div>
      <Toaster/>
    </>
  );
}
