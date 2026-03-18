import { useEffect } from "react"
import { Table, TableCaption, TableRow, TableHead, TableHeader, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { useStates } from "@/context/StatesContext"
import type { Transaction } from "@/types/transaction"
import { format } from "date-fns"
import useDateFormatter from "@/hooks/useDateFormatter"


export default function Borrow() {
const {transactions, setTransactions, bookToReturn, setBookToReturn} = useStates()
const {formatAnyDate} = useDateFormatter()










useEffect(() => {
  const q = query(collection(db, "borrowings"), where("status", "==", "issued"))
 const unsubscribe = onSnapshot((q), (snap) => {
  setTransactions(snap.docs.map((doc) => ({
    ...doc.data() as Transaction,
    transactionId: doc.id,
  })))
 })
}, [])
  return (
                    <Table>
                  <TableCaption>List Of All Books</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-amber-600">Book Title</TableHead>
                      <TableHead className="text-amber-600">Book Author</TableHead>
                      <TableHead className="text-amber-600">Name</TableHead>
                      <TableHead className="text-amber-600">Stu/Staff No</TableHead>
                      
                      <TableHead className="text-amber-600 text-left">Contact</TableHead>

                      <TableHead className="text-amber-600">Status</TableHead>
                      <TableHead className="text-amber-600">Date Borrowed</TableHead>
                      <TableHead className="text-amber-600">Date due</TableHead>
                      
                      <TableHead className="text-amber-600 text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {

                    transactions.map((transaction) => (
                      <TableRow key={transaction.transactionId}>
                        <TableCell>{transaction.bookTitle}</TableCell>
                        <TableCell>{transaction.bookAuthor}</TableCell>
                        <TableCell>{transaction.name}</TableCell>
                        <TableCell>{transaction.stuOrStaffNo}</TableCell>
                        <TableCell>{transaction.contact}</TableCell>
                         <TableCell className="text-emerald-500">{transaction.status}</TableCell>
                          <TableCell>{formatAnyDate(transaction.dateBorrowed)}</TableCell>
                         <TableCell>{formatAnyDate(transaction.dueDate)}</TableCell>
                        
                         <TableCell onClick={() => setBookToReturn(transaction.transactionId)} className="text-right"><Button className="bg-amber-600 cursor-pointer text-slate-950 hover:bg-amber-500" variant={"default"}>Return</Button></TableCell>

                         
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
  )
}
