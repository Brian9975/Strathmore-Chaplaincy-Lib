import type { Timestamp } from 'firebase/firestore'
import React, { createContext, useContext, useState } from 'react'
import type { UserRole } from '@/types/userRole'
import type { UserInfo } from '@/types/userInfo'

interface StatesContextType {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean, 
    alert: boolean, 
    setAlert: React.Dispatch<React.SetStateAction<boolean>>,
    adminToRemove: string | null ,
    setAdminToRemove: React.Dispatch<React.SetStateAction<string | null>>
    accessOff: boolean,
    setAccessOff: React.Dispatch<React.SetStateAction<boolean>>,
    adminToRestore: string | null,
    setAdminToRestore: React.Dispatch<React.SetStateAction<string | null>>,
    accessOn: boolean,
    setAccessOn: React.Dispatch<React.SetStateAction<boolean>>,
    admins: UserInfo[],
    setAdmins: React.Dispatch<React.SetStateAction<UserInfo[]>>,

}


export const StateContext = createContext< StatesContextType | undefined >(undefined)
export default function StatesContextProvider({children}: {children: React.ReactNode}) {
 const [admins, setAdmins] = useState<UserInfo[]>([])      
 const [open, setOpen] = useState(false)
 const [ alert, setAlert] = useState(false)
 const [adminToRemove, setAdminToRemove] = useState< string | null >(null)
 const [accessOff, setAccessOff] = useState(false)
 const [adminToRestore, setAdminToRestore] = useState<string | null>(null)
 const [accessOn, setAccessOn] = useState(false)

    const contextValue = {setOpen, open, alert, setAlert, adminToRemove, setAdminToRemove, accessOff, setAccessOff, adminToRestore, setAdminToRestore, accessOn, setAccessOn, admins, setAdmins}
  return (
 <StateContext value={contextValue}>{children}</StateContext>
  )
}

export const useStates = () => {
    const context = useContext(StateContext)

    if (context === undefined) {
        throw new Error("useStates must be within StatesContextProvider")

    }
     return context
}
