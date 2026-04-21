import { useEffect, useState } from "react";
import {
  Table,
  TableCaption,
  TableRow,
  TableHead,
  TableHeader,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { useStates } from "@/context/StatesContext";
import type { Transaction } from "@/types/transaction";
import { BookX, CheckCircle2 } from "lucide-react";
import useDateFormatter from "@/hooks/useDateFormatter";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import useReturnBook from "@/hooks/useReturnBook";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import useLoanOverdue from "@/hooks/useLoanOverdue";
export default function ActiveTransactions() {
  const {
    transactions,
    setTransactions,
    loanToUpdate,
    setLoanToUpdate,
    alertReturn,
  } = useStates();
  const { formatAnyDate } = useDateFormatter();
  const { handleReturn } = useReturnBook();
  const navigate = useNavigate();
  const [loadLoan, setLoadLoan] = useState(true)
  const [searchTerm, setSearchTerm] = useState("");
  const { loanIsOverdue } = useLoanOverdue();
  const loanToUpdateInfo = transactions.find(
    (transaction) => transaction.transactionId === loanToUpdate,
  );


  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const q = query(
      collection(db, "borrowings"),
      where("status", "==", "issued"),
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setTransactions(
        snap.docs.map((doc) => ({
          ...(doc.data() as Transaction),
          transactionId: doc.id,
        })),
      );
      setLoadLoan(false)
    });
    return () => unsubscribe();
  }, []);
  return (
    <div>
      <h1 className="font-bold p-4 text-2xl">Active & Overdue Transactions</h1>

      {/* Search Filter For Transactions */}
     { transactions.length !== 0 && <div className="flex mb-5 mt-8 justify-center">
        <Input
          type="text"
          value={searchTerm}
          className="w-xl"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search transaction by book title or borrower's name... "
        />
      </div>
}
     {  loadLoan ?  <div className="flex w-full p-4 flex-col gap-2">
            {Array.from({ length: 100 }).map((_, index) => (
              <div className="flex gap-4" key={index}>
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-10" />
                <Skeleton className="h-9 w-20" />
              </div>
            ))}
          </div>  : transactions.length === 0 ? 
          (<div className="text-center">
            <div className="border mt-10 shadow-xs dark:shadow-white rounded-lg mx-4 mb-5 py-7">
            <div className="flex justify-center mb-2">
               <BookX size={35}/>
               </div>
              <h1 className="dark:text-[#FAF8F0] font-bold text-[#1C1A17] text-center text-lg  sm:text-2xl">
                There are no transactions at the moment.
              </h1>
              <p className="mx-2">Active and Overdue Transactions will appear here.</p>
            
            </div>
            <Button onClick={() => navigate("/books")} className="cursor-pointer" variant={"default"}>Go To Books</Button>
          </div> )  :  <Table>
        <TableCaption>List Of All Active And Overdue Loans</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-button-1 font-bold md:text-lg">Book Title</TableHead>
            <TableHead className="text-button-1 font-bold md:text-lg">Book Author</TableHead>
            <TableHead className="text-button-1 font-bold md:text-lg">Name</TableHead>
            <TableHead className="text-button-1 font-bold md:text-lg">Stu/Staff No</TableHead>

            <TableHead className="text-button-1 font-bold md:text-lg text-left">Contact</TableHead>

            <TableHead className="text-button-1 font-bold md:text-lg  text-center">
              Status
            </TableHead>
            <TableHead className="text-button-1 font-bold md:text-lg">Date Borrowed</TableHead>
            <TableHead className="text-button-1 font-bold md:text-lg">Date due</TableHead>

            <TableHead className="text-button-1 font-bold md:text-lg text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((transaction) => (
            <TableRow key={transaction.transactionId}>
              <TableCell>{transaction.bookTitle}</TableCell>
              <TableCell>{transaction.bookAuthor}</TableCell>
              <TableCell>{transaction.name}</TableCell>
              <TableCell>{transaction.stuOrStaffNo}</TableCell>
              <TableCell>{transaction.contact}</TableCell>
              <TableCell>
                <p
                  className={`${loanIsOverdue(transaction.dueDate) ? "text-slate-50 bg-red-500" : "text-emerald-500"} text-center p-3`}
                >
                  {loanIsOverdue(transaction.dueDate) ? "OVERDUE" : "ACTIVE"}
                </p>
              </TableCell>
              <TableCell>{formatAnyDate(transaction.dateBorrowed)}</TableCell>
              <TableCell>{formatAnyDate(transaction.dueDate)}</TableCell>
              <TableCell
                onClick={() => setLoanToUpdate(transaction.transactionId)}
                className="text-right"
              >
                <Button
                  className="bg-highlights hover:bg-warn cursor-pointer text-[#1C1A17]"
                  
                >
                  Return
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
}
      {/* Alert Dialog For Handling Return */}
      <AlertDialog
        open={!!loanToUpdate}
        onOpenChange={() => setLoanToUpdate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately return book with title "
              {loanToUpdateInfo?.bookTitle}", update the status of this
              transaction and clear {loanToUpdateInfo?.name}'s loan
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={() => {
                if (loanToUpdate !== null) {
                  handleReturn(loanToUpdate);
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="fixed right-4 bottom-4 ">
        {alertReturn && (
          <Alert className="max-w-md">
            <CheckCircle2 color="green" />
            <AlertTitle className="text-md">
              Book Returned And Updated Successfully
            </AlertTitle>
          </Alert>
        )}
      </div>
    </div>
  );
}
