import React, {useState} from "react"
import { addNewAdmin } from "@/lib/sec-firebase-config"


export default function useAddAdmin() {
      const [adminName, setAdminName] = useState("")
      const [adminEmail, setAdminEmail] = useState("")
      const [adminPassword, setAdminPassword] = useState("")
    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    try{
        await addNewAdmin(adminEmail, adminPassword, adminName)
        // await setDoc(doc(db, "users", user.uid), {
        //   name: adminName,
        //   email: adminEmail,
        //   role: "admin",
        //   createdAt: serverTimestamp(),
        // })

      console.log("Success")  
    } catch (error) {
        console.log(error)
    }
  
    } 
  return {handleForm, adminName, adminEmail, adminPassword, setAdminName, setAdminEmail, setAdminPassword}
}
