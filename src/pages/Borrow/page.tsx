import { useEffect } from "react"
import { Table, TableCaption, TableRow, TableHead, TableHeader, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { useStates } from "@/context/StatesContext"
import type { Transaction } from "@/types/transaction"
import { CheckCircle2 } from "lucide-react"
import useDateFormatter from "@/hooks/useDateFormatter"
import { AlertDialog, AlertDialogCancel, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from "@/components/ui/alert-dialog"
import useReturnBook from "@/hooks/useReturnBook"
import { Alert, AlertTitle } from "@/components/ui/alert"
export default function Borrow() {
const {transactions, setTransactions, loanToUpdate, setLoanToUpdate, alertReturn} = useStates()
const {formatAnyDate} = useDateFormatter()
const {handleReturn} = useReturnBook()

const loanToUpdateInfo = transactions.find(transaction => transaction.transactionId === loanToUpdate)









useEffect(() => {
  const q = query(collection(db, "borrowings"), where("status", "==", "issued"))
 const unsubscribe = onSnapshot((q), (snap) => {
  setTransactions(snap.docs.map((doc) => ({
    ...doc.data() as Transaction,
    transactionId: doc.id,
  })))
 })
 return () => unsubscribe()
}, [])
  return (    <div>
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
                        
                         <TableCell onClick={() => setLoanToUpdate(transaction.transactionId)} className="text-right"><Button className="bg-amber-600 cursor-pointer text-slate-950 hover:bg-amber-500" variant={"default"}>Return</Button></TableCell>

                         
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Alert Dialog For Handling Return */}
                          <AlertDialog open={!!loanToUpdate} onOpenChange={() => setLoanToUpdate(null)}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                      This will immediately return book with title "{loanToUpdateInfo?.bookTitle}", update the status of this transaction and clear {loanToUpdateInfo?.name}'s loan
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="cursor-pointer" onClick={() => {
                              if (loanToUpdate !== null) {
                               handleReturn(loanToUpdate)
                              }
                            }}>
                               Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                <div className="fixed right-4 bottom-4 ">
                  {
               alertReturn &&
                  <Alert className="max-w-md">
                      <CheckCircle2 color="green"/>
                      <AlertTitle className="text-md">Book Returned And Updated Successfully</AlertTitle>
                  
                    </Alert>
}
                    </div>
                </div>
  )
}
