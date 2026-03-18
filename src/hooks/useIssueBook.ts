import { useStates } from '@/context/StatesContext'
import { db } from '@/lib/firebase-config'
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import  {useState} from 'react'

export default function useIssueBook() {
    const {setBookToIssue} = useStates()
    const [borrowerName, setBorrowerName] = useState("")
    const [stuOrStaffNo, setStuOrStaffNo] = useState(301603)
    const [borrowerContact, setBorrowerContact] = useState(712345678)
    const [dueDate, setDueDate] = useState<Date>(() => { 
       const date = new Date()
       date.setDate(date.getDate() + 7)
       return date
    })

    const handleBookIssuance = async (e: React.FormEvent<HTMLFormElement>, bookId: string) => {
      e.preventDefault()


   
   const  borrowCollectionRef = collection(db, "borrowings")

   try {
     await runTransaction(db, async (transaction) => {
    
   const bookDoc = await transaction.get(doc(db, "books", bookId))
   const copiesAvailable = bookDoc.data()?.availableCopies
   
   if (copiesAvailable <= 0) {
    alert("No copies Available")
    return
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
   } catch (error) {

   } finally {
    setBookToIssue(null)

   }
    


    }
  return {handleBookIssuance, borrowerName, borrowerContact, stuOrStaffNo, dueDate, 
    setBorrowerContact, setStuOrStaffNo, setBorrowerName, setDueDate
  }
}
