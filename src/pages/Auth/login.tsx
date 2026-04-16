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

import StrathLogo2 from "@/img/strathLogo2.png"
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleX, Eye, EyeOff } from "lucide-react";
import useBrandTheme from "@/hooks/useBrandTheme";
import { ModeToggle } from "@/components/themeToggle";
export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [alertError, setAlertError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()
  const { loading, user, setLoading } = useAuth()
  const {brandThemes} = useBrandTheme()
  const[showPassword, setShowPassword] = useState(false)
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
      <div className={`bg-[${brandThemes["primary-light"]}] overflow-hidden dark:bg-primary-background min-h-screen`}>
       <div className="mb-3 p-4 flex justify-end">
        <ModeToggle/>
       </div>

       <div className="justify-center flex  items-center">
        <form onSubmit={logAdminIn} className="flex border mb-4  rounded-lg shadow-xs dark:shadow-white py-2 px-6 md:px-25 flex-col items-center gap-5">


           <div className="flex items-center flex-col justify-center">
            <img width={200} className="hidden  dark:block"  src={StrathLogo1} alt="strathmore logo" />

            <img className="dark:hidden py-3 block" src={StrathLogo2} width={74}  alt="" />
            <div>
             <h1 className="text-2xl">Chaplaincy Library System</h1>
            </div>
            
           </div>

                   <FieldGroup className="md:w-100">
                       <Field className="">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" className=" border-[#1C1A17] dark:border-[#FAF8F0]" value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" placeholder="Email" />
                      </Field>
                      <Field >
                        <Label  htmlFor="password">Password</Label>
                        <div className="relative
                        ">
                        <Input id="password" className="border-[#1C1A17] dark:border-[#FAF8F0]" value={password} onChange={e => setPassword(e.target.value)} type={showPassword ? "text" : "password"} name="password" placeholder=" Password"/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute  top-1/2 right-3 -translate-y-1/2 hover:opacity-80  cursor-pointer ">
                         {showPassword ? <EyeOff/> : <Eye/>}
                        </button>
                        </div>
                      </Field>
                    </FieldGroup>
         <Button type="submit" variant="default" className="h-10 mb-5 mt-4 hover:opacity-80 shadow-md text-lg  shadow-gray-700 rounded-lg bg-[#1C1A17] dark:bg-[#FAF8F0] cursor-pointer font-bold w-full">Login</Button>
        </form>
        </div>
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
