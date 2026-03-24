import { Table, TableCaption, TableBody, TableHead, TableCell, TableRow, TableHeader,  } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import { useStates } from "@/context/StatesContext"
import type { LoanHistory } from "@/types/loanHistory"
import useDateFormatter from "@/hooks/useDateFormatter"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"




export default function TransactionsHistory() {
const [searchTerm, setSearchTerm] = useState("")
const {loansHandled, setLoansHandled} = useStates()
const {formatAnyDate} = useDateFormatter()
const [loadHistory, setLoadHistory] = useState(true)

const filteredLoansHandled = loansHandled.filter(loan => loan.name.toLowerCase().includes(searchTerm.toLowerCase()) || loan.bookTitle.toLowerCase().includes(searchTerm.toLowerCase())) 



  useEffect(() => {
const q = query(collection(db, "borrowings"), where("status", "==", "returned"))
const unsubscribe = onSnapshot(q, (snap) => {
  setLoansHandled(snap.docs.map(doc => ({
    ...doc.data() as LoanHistory,
    id: doc.id
  })))
  setLoadHistory(false)
})
return () => unsubscribe()
  }, [])
  return (
  <div>
    <h1 className="font-bold p-4 text-2xl">Transactions History</h1>
                   {/* Search Filter For  Loans Handled*/}
                 { loansHandled.length !== 0 &&   <div className="flex mb-5 mt-8 justify-center">
                      <Input
                        type="text"
                        value={searchTerm}
                        className="w-xl"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search transaction history by book title or borrower's name... "
                      />
                    </div>
}
           { loadHistory ? (
                     <div className="flex w-full p-4 flex-col gap-2">
                       {Array.from({ length: 100 }).map((_, index) => (
                         <div className="flex gap-4" key={index}>
                           <Skeleton className="h-9 flex-1" />
                           <Skeleton className="h-9 w-24" />
                           <Skeleton className="h-9 w-10" />
                           <Skeleton className="h-9 w-20" />
                         </div>
                       ))}
                     </div>
                   ) : loansHandled.length === 0 ? <div className="flex flex-col justify-center gap-5 items-center">
            <div>
              <p className="dark:text-[#FAF8F0] text-[#1C1A17] text-center pt-20 text-2xl">
               Loans history will appear here.
              </p>
            
            </div>

          </div> :  <Table>
            <TableCaption>Transactions History</TableCaption>
            <TableHeader>
              <TableRow>
                      <TableHead className="text-button-2 font-bold md:text-lg">Book Title</TableHead>
                      <TableHead className="text-button-2 font-bold md:text-lg">Book Author</TableHead>
                      <TableHead className="text-button-2 font-bold md:text-lg">Name</TableHead>
                      <TableHead className="text-button-2 font-bold md:text-lg">Stu/Staff No</TableHead>
                      
                      <TableHead className="text-button-2 font-bold md:text-lg text-left">Contact</TableHead>

                      <TableHead className="text-button-2 font-bold md:text-lg">Status</TableHead>
                      <TableHead className="text-button-2 font-bold md:text-lg">Date Returned</TableHead>
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
                    {loan.status.toUpperCase()}
                  </TableCell>
                  <TableCell>{formatAnyDate(loan.dateReturned)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

            }
  </div>
  )
}
