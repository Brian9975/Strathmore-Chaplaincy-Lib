import { useAuth } from '@/context/AuthContext'
import { useStates } from '@/context/StatesContext'
import { db } from '@/lib/firebase-config'
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import  {useState} from 'react'
import { toast } from 'sonner'

export default function useIssueBook() {
    const {setBookToIssue, setAlertIssue} = useStates()
    const {setLoading} = useAuth()
    const [borrowerName, setBorrowerName] = useState("")
    const [stuOrStaffNo, setStuOrStaffNo] = useState(301603)
    const [borrowerContact, setBorrowerContact] = useState(0)
    const [dueDate, setDueDate] = useState<Date>(() => { 
       const date = new Date()
       date.setDate(date.getDate() + 7)
       return date
    })

    const handleBookIssuance = async (e: React.FormEvent<HTMLFormElement>, bookId: string) => {
      e.preventDefault()

   if (!borrowerName) {
    toast.warning("Required!! Please include the borrowers name", {position: "top-center"})
    return
   }
   else if  (!stuOrStaffNo) {

    toast.warning("Required!! Please include a student or staff number", {position: "top-center"})
    return
   }
   else if (!borrowerContact) {
    toast.warning("Required!! Please include the borrower's contact", {position: "top-center"})
    return
   }
   


   setLoading(true)
   const  borrowCollectionRef = collection(db, "borrowings")
   try {
     await runTransaction(db, async (transaction) => {
    
   const bookDoc = await transaction.get(doc(db, "books", bookId))
   const copiesAvailable = bookDoc.data()?.availableCopies
   
   if (copiesAvailable <= 0) {
   throw new Error("No copies available")
   }
  
  //  Decrease The Number Of Available copies by 1

  transaction.update(doc(db, "books", bookId), {
    availableCopies: copiesAvailable - 1
  })


  // Creating a borrowing Record
  const newBorrowRef = doc(borrowCollectionRef)

  transaction.set(newBorrowRef, {

    bookId: bookId,
    bookTitle: bookDoc.data()?.title,
    bookAuthor: bookDoc.data()?.author,
    name: borrowerName,
    stuOrStaffNo: stuOrStaffNo,
    contact: borrowerContact,
    dueDate: dueDate,
    status: "issued",
    dateBorrowed: serverTimestamp()
  })   
     })
     setBorrowerName("")
     setAlertIssue(true)
     setTimeout(() => {
      setAlertIssue(false)
     }, 6000)
   } catch (error) {
     toast.warning(`${error}`)
   } finally {
    setBookToIssue(null)
    setLoading(false)
   }
  }


  return {handleBookIssuance, borrowerName, borrowerContact, stuOrStaffNo, dueDate, 
    setBorrowerContact, setStuOrStaffNo, setBorrowerName, setDueDate
  }
}
