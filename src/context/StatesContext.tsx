import React, { createContext, useContext, useState } from 'react'


interface StatesContextType {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean, 
    alert: boolean, 
    setAlert: React.Dispatch<React.SetStateAction<boolean>>,
    adminToRemove: string | null ,
    setAdminToRemove: React.Dispatch<React.SetStateAction<string | null>>
,
}
export const StateContext = createContext< StatesContextType | undefined >(undefined)
export default function StatesContextProvider({children}: {children: React.ReactNode}) {
 const [open, setOpen] = useState(false)
 const [ alert, setAlert] = useState(false)
 const [adminToRemove, setAdminToRemove] = useState< string | null >(null)


    const contextValue = {setOpen, open, alert, setAlert, adminToRemove, setAdminToRemove}
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
