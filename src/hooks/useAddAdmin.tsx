import React, {useState} from "react"
import { addNewAdmin } from "@/lib/sec-firebase-config"
import { useStates } from "@/context/StatesContext"
import { useAuth } from "@/context/AuthContext"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-config"


export default function useAddAdmin() {
      const [adminName, setAdminName] = useState("")
      const [adminEmail, setAdminEmail] = useState("")
      const [adminPassword, setAdminPassword] = useState("")
      const {setOpen, setAlert, setAccessOff, setAccessOn, admins} = useStates()
      const { setLoading } = useAuth()
    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
          const existingAdmin = admins.find(admin => admin.email === adminEmail)

  if (existingAdmin && existingAdmin.role === "inactive" ) {
    setLoading(true)
    try{
       await updateDoc(doc(db, "users", existingAdmin.id), {
      role: "admin"
    })
    setAccessOn(true)
    setTimeout(() => {
     setAccessOn(false)
    }, 6000)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
      setOpen(false)
    }
   
    return
  }
    try{
        await addNewAdmin(adminEmail, adminPassword, adminName, setOpen, setLoading, setAlert, admins)
      console.log("Success")  
    } catch (error) {
        console.log(error)
    } 
    } 

    const removeAccess = async (adminId: string) => {
        setLoading(true)
      try{
         await updateDoc(doc(db, "users", adminId), 
        {
          role: "inactive",
        }
        )

        setAccessOff(true)
        setTimeout(() => {
        setAccessOff(false)
        }, 6000)
         
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    const restoreAccess = async (adminId: string) => {
       setLoading(true)
       try {
        await updateDoc(doc(db, "users", adminId), {
          role: "admin",
        })

        setAccessOn(true)
        setTimeout(() => {
          setAccessOn(false)
        }, 6000)
       } catch (error) {
         console.log(error)
       } finally {
        setLoading(false)
       }
               
    }
  return {handleForm, adminName, adminEmail, adminPassword, setAdminName, setAdminEmail, setAdminPassword, removeAccess, restoreAccess}
}
