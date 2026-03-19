import { Table, TableCaption, TableBody, TableHead, TableCell, TableRow, TableHeader,  } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { useStates } from "@/context/StatesContext"
import type { LoanHistory } from "@/types/loanHistory"
import useDateFormatter from "@/hooks/useDateFormatter"
import { Input } from "@/components/ui/input"




export default function TransactionsHistory() {
const [searchTerm, setSearchTerm] = useState("")
const {loansHandled, setLoansHandled} = useStates()
const {formatAnyDate} = useDateFormatter()

const filteredLoansHandled = loansHandled.filter(loan => loan.name.toLowerCase().includes(searchTerm.toLowerCase()) || loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())) 



  useEffect(() => {
const q = query(collection(db, "borrowings"), where("status", "==", "returned"))
const unsubscribe = onSnapshot(q, (snap) => {
  setLoansHandled(snap.docs.map(doc => ({
    ...doc.data() as LoanHistory,
    id: doc.id
  })))
})
return () => unsubscribe()
  }, [])
  return (
  <div>

                   {/* Search Filter For  Loans Handled*/}
                    <div className="flex mb-5 mt-8 justify-center">
                      <Input
                        type="text"
                        value={searchTerm}
                        className="w-xl"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search transaction history by book title or borrower's name... "
                      />
                    </div>
             <Table>
            <TableCaption>Transactions History</TableCaption>
            <TableHeader>
              <TableRow>
                      <TableHead className="text-amber-600">Book Title</TableHead>
                      <TableHead className="text-amber-600">Book Author</TableHead>
                      <TableHead className="text-amber-600">Name</TableHead>
                      <TableHead className="text-amber-600">Stu/Staff No</TableHead>
                      
                      <TableHead className="text-amber-600 text-left">Contact</TableHead>

                      <TableHead className="text-amber-600">Status</TableHead>
                      <TableHead className="text-amber-600">Date Returned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoansHandled.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.bookTitle}</TableCell>
                  <TableCell>{loan.bookAuthor}</TableCell>
                  <TableCell>{loan.name}</TableCell>
                  <TableCell>{loan.stuOrStaffNo}</TableCell>

                  <TableCell className="">
                   {loan.contact}
                  </TableCell>
                  <TableCell className="text-emerald-500">
                    {loan.status}
                  </TableCell>
                  <TableCell>{formatAnyDate(loan.dateReturned)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
  </div>
  )
}
