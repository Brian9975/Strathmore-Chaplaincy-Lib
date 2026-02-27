import React, { useState } from "react"
import { auth } from "@/lib/firebase-config"
import { createUserWithEmailAndPassword } from "firebase/auth"

export default function useAddAdmin() {
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")

    const addAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    try{
        const { user } = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)

        console.log(user)
    } catch (error) {
        console.log(error)
    }
    
    } 
  return {addAdmin, adminName, adminEmail, adminPassword, setAdminEmail, setAdminName, setAdminPassword}
}
