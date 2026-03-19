import { useAuth } from "@/context/AuthContext"
import { useStates } from "@/context/StatesContext"
import { db } from "@/lib/firebase-config"
import { doc, runTransaction, serverTimestamp } from "firebase/firestore"

export default function useReturnBook() {
 const {setAlertReturn, setLoanToUpdate} = useStates()
 const {setLoading} = useAuth()

    const handleReturn = async (loanId: string) => {
    
    

    
    setLoading(true)
    const loanRef = doc(db, "borrowings", loanId)
      try {
     await runTransaction(db, async (transaction) => {
      const borrowingDoc = await transaction.get(loanRef)
      const bookToUpdateId = borrowingDoc.data()?.bookId

      const bookRef = doc(db, "books", bookToUpdateId)
      const bookDoc = await transaction.get(bookRef)
      const available = bookDoc.data()?.availableCopies

       transaction.update(bookRef, {
        availableCopies: available + 1
      })

     

    transaction.update(loanRef, {
      status: "returned",
      dateReturned: serverTimestamp()
    })
      })

      setAlertReturn(true)
      setTimeout(() => {
       setAlertReturn(false)
      }, 6000)
    } catch (error) {
      console.log(error)
    } finally {
     setLoading(false)
     setLoanToUpdate(null)
    }
        
    }
  return {handleReturn}
}
