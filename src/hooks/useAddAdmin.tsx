import React, {useState} from "react"
import { addNewAdmin } from "@/lib/sec-firebase-config"
import { useStates } from "@/context/StatesContext"
import { useAuth } from "@/context/AuthContext"
import { deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase-config"


export default function useAddAdmin() {
      const [adminName, setAdminName] = useState("")
      const [adminEmail, setAdminEmail] = useState("")
      const [adminPassword, setAdminPassword] = useState("")
      const {setOpen, setAlert} = useStates()
      const { setLoading } = useAuth()
    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    try{
        await addNewAdmin(adminEmail, adminPassword, adminName, setOpen, setLoading, setAlert)
      console.log("Success")  
    } catch (error) {
        console.log(error)
    }
  
    } 

    const removeAdminAccount = async (adminId: string) => {
        setLoading(true)
      try{
         await deleteDoc(doc(db, "users", adminId))
         
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  return {handleForm, adminName, adminEmail, adminPassword, setAdminName, setAdminEmail, setAdminPassword, removeAdminAccount}
}
