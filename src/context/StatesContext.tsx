import React, { createContext, useContext, useState } from 'react'


interface StatesContextType {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    open: boolean, 
    alert: boolean, 
    setAlert: React.Dispatch<React.SetStateAction<boolean>>,
    confirmDel: boolean, 
    setConfirmDel: React.Dispatch<React.SetStateAction<boolean>>,
}
export const StateContext = createContext< StatesContextType | undefined >(undefined)
export default function StatesContextProvider({children}: {children: React.ReactNode}) {
 const [open, setOpen] = useState(false)
 const [ alert, setAlert] = useState(false)
 const [confirmDel, setConfirmDel] = useState(false)


    const contextValue = {setOpen, open, alert, setAlert, confirmDel, setConfirmDel}
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
