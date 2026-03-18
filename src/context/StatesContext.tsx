import React, { createContext, useContext, useState } from 'react'
import type { UserInfo } from '@/types/userInfo'
import type { Book } from '@/types/book'
import type { Transaction } from '@/types/transaction'

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
    openBookForm: boolean,
    setOpenBookForm: React.Dispatch<React.SetStateAction<boolean>>,
    books: Book[],
    setBooks: React.Dispatch<React.SetStateAction<Book[]>>,
    bookToEdit: string | null,
    setBookToEdit: React.Dispatch<React.SetStateAction<string | null>>,
    alertEdit: boolean,
    setAlertEdit: React.Dispatch<React.SetStateAction<boolean>>,
    alertAdd: boolean,
    setAlertAdd: React.Dispatch<React.SetStateAction<boolean>>,
    bookToDelete: string | null
    setBookToDelete: React.Dispatch<React.SetStateAction<string | null>>,
    alertDel: boolean,
    setAlertDel: React.Dispatch<React.SetStateAction<boolean>>,
    bookToIssue: string | null,
    setBookToIssue: React.Dispatch<React.SetStateAction<string | null>>,
    transactions: Transaction[],
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
    bookToReturn: string | null,
    setBookToReturn: React.Dispatch<React.SetStateAction<string | null>>,
}


export const StateContext = createContext< StatesContextType | undefined >(undefined)
export default function StatesContextProvider({children}: {children: React.ReactNode}) {
 const [admins, setAdmins] = useState<UserInfo[]>([])    
 const [books, setBooks] = useState<Book[]>([])  
 const [open, setOpen] = useState(false)
 const [openBookForm, setOpenBookForm] = useState(false)
 const [ alert, setAlert] = useState(false)
 const [adminToRemove, setAdminToRemove] = useState< string | null >(null)
 const [accessOff, setAccessOff] = useState(false)
 const [adminToRestore, setAdminToRestore] = useState<string | null>(null)
 const [accessOn, setAccessOn] = useState(false)
 const [bookToEdit, setBookToEdit] = useState<string | null>(null)
 const [alertEdit, setAlertEdit] = useState(false)
 const [alertAdd, setAlertAdd] = useState(false)
 const [bookToDelete, setBookToDelete] = useState<string | null>(null)
 const [alertDel, setAlertDel] = useState(false)
 const [bookToIssue, setBookToIssue] = useState<string | null>(null)
 const [transactions, setTransactions] = useState<Transaction[]>([])
 const [bookToReturn, setBookToReturn] = useState<string | null>(null)


    const contextValue = {books, bookToReturn, setBookToReturn, transactions, setTransactions, bookToIssue, setBookToIssue, alertDel, setAlertDel, alertAdd, setAlertAdd, setBooks, bookToEdit, setBookToEdit, setOpen, open, alert, setAlert, adminToRemove, setAdminToRemove, accessOff, setAccessOff, adminToRestore, setAdminToRestore, accessOn, setAccessOn, admins, setAdmins, openBookForm, setOpenBookForm, alertEdit, setAlertEdit, bookToDelete, setBookToDelete}
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
