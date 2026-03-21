import { db } from "@/lib/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner";
import { BookCheck, BookUp, ClockAlert, Library } from "lucide-react";




export default function Dashboard() {

const [loadStats, setLoadStats] = useState(true)
const [stats, setStats] = useState({
  totalBooks: 0,
  availableCopies: 0,
  overdueTransactions: 0,
  activeTransactions: 0
})


   const showStats = async () => {
    try{
    const booksRef = collection(db, "books")
    const bookDocs = await getDocs(booksRef)
   let totalBooks = bookDocs.size

   let availableCopies = 0
   bookDocs.forEach(doc => {
    availableCopies += doc.data().availableCopies 
   })

   let today = new Date()
   today.setHours(0, 0, 0, 0)
   const borrowingsRef = collection(db, "borrowings")
   const transactionsQuery = query(borrowingsRef, where("status", "==", "issued"), where("dueDate", ">", today))
    const issuedDocs = await getDocs(transactionsQuery)
    const activeTransactions = issuedDocs.size

    const overdueQuery = query(borrowingsRef, where("status", "==", "issued"), where("dueDate","<", today))

   const overdueDocs = await getDocs(overdueQuery)
  const overdueTransactions = overdueDocs.size


  setStats({
    totalBooks,
    availableCopies, 
    activeTransactions,
    overdueTransactions
  })
} catch (error) {
  console.log(`Falied to load stats ${error}`)
}finally{
    setLoadStats(false)
   }

   } 




  useEffect(() => {
showStats()
  }, [])
  return <div >
    <h1 className="font-bold p-4 text-2xl">Dashboard</h1>
   <div className="flex gap-4 flex-col items-center md:grid m-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 md:justify-items-center">
     <Card className="w-80 shadow-lg shadow-slate-700 md:w-50 bg-slate-900 border-0 text-slate-50">
  <CardHeader>
    <CardTitle className="text-xl">Total Books</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex justify-end mb-6"><div><Library size={30}/></div></div>
    <p className="text-3xl font-bold">{loadStats ? <Spinner className="size-8"/> : stats.totalBooks}</p>
  </CardContent>

</Card>
     <Card className="w-80 shadow-lg shadow-slate-700 md:w-50 bg-slate-900 border-0 text-slate-50">
  <CardHeader>
    <CardTitle className="text-xl">Avail. Copies</CardTitle>
   
  </CardHeader>
  <CardContent>
      <div className="flex justify-end mb-6"><div><BookCheck size={30}/></div></div>
    <p className="text-3xl font-bold">{loadStats ? <Spinner className="size-8"/> : stats.availableCopies}</p>
  </CardContent>

</Card>

     <Card className="w-80 shadow-lg shadow-slate-700 md:w-50 bg-slate-900 border-0 text-slate-50">
  <CardHeader>
    <CardTitle className="text-xl">Active Loans</CardTitle>
   
  </CardHeader>
  <CardContent>
      <div className="flex justify-end mb-6"><div><BookUp size={30}/></div></div>
    <p className="text-3xl font-bold">{loadStats ? <Spinner className="size-8"/> : stats.activeTransactions}</p>
  </CardContent>

</Card>

    <Card className="w-80 shadow-lg shadow-slate-700 md:w-50 bg-slate-900 border-0 text-slate-50">
  <CardHeader>
    <CardTitle className="text-xl">Overdue Loans</CardTitle>
   
  </CardHeader>
  <CardContent>
      <div className="flex justify-end mb-6"><div><ClockAlert size={30}/></div></div>
    <p className="text-3xl font-bold">{loadStats ? <Spinner className="size-8"/> : stats.overdueTransactions}</p>
  </CardContent>

</Card>


   </div>

   <p className="p-4 text-2xl">Welcome Admin,</p>
  </div>;
}
