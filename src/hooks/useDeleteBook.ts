import { useAuth } from "@/context/AuthContext"
import { useStates } from "@/context/StatesContext"
import { db } from "@/lib/firebase-config"
import { deleteDoc, doc } from "firebase/firestore"


export default function useDeleteBook() {
    const {setAlertDel} = useStates()
    const {setLoading} = useAuth()

  const handleDeleteBook = async (bookId: string) => {
   setLoading(true)
   try {
    await deleteDoc(doc(db, "books", bookId))
    setAlertDel(true)
    setTimeout(() => {
     setAlertDel(false)
    }, 6000)
   } catch (error) {

   } finally {
   setLoading(false)
   }
  }
  return {
  handleDeleteBook
  }
}
