import { useStates } from '@/context/StatesContext'
import { doc, updateDoc } from 'firebase/firestore'
import React, {useState} from 'react'
import { db } from '@/lib/firebase-config'
import { useAuth } from '@/context/AuthContext'
import { toast } from 'sonner'
export default function useEditBook() {
  
      const [editAuthor, setEditAuthor] = useState("")
      const [editTitle, setEditTitle] = useState("")
      const [editTotalCopies, setEditTotalCopies] = useState(1)
      const [editAvailableCopies, setEditAvailableCopies] = useState(0)
      const { setLoading} = useAuth()
      const {setBookToEdit, setAlertEdit} = useStates()


    const handleEditForm = async (e: React.FormEvent<HTMLFormElement>, editingId: string) => {
      e.preventDefault()


      if (!editTitle) {
        toast.warning("Fill the title field", {position: "top-center"})
        return
      } else if (!editAuthor) {
        toast.warning("Fill the author field", {position: "top-center"})
        return
      } else if (editTotalCopies < editAvailableCopies) {
        toast.warning(`Total copies ${editTotalCopies} cannot be less than available copies ${editAvailableCopies}`, {position: "top-center"})
        return
      } else if (editTotalCopies <= 0) {
        toast.warning(`Total copies ${editTotalCopies} cannot be less than or equal to 0`, {position: "top-center"})
        return
      }
      else if (editAvailableCopies < 0) {

         toast.warning(`Available copies ${editAvailableCopies} cannot be less than 0`, {position: "top-center"})
        return
      }
      else{
      setLoading(true)
      try {
        await updateDoc(doc(db, "books", editingId), {
         title: editTitle,
         author: editAuthor,
         totalCopies: editTotalCopies,
         availableCopies: editAvailableCopies
        })

        setAlertEdit(true)
        setTimeout(() => {
          setAlertEdit(false)
        }, 6000)
      } catch (error) {
       toast.error("An error occured while editing book", {position: "top-center"})
      } finally {
        setLoading(false)
        setBookToEdit(null)
      }
 
    }
    }
  return {handleEditForm, editAuthor, setEditAuthor, editTitle, setEditTitle, editTotalCopies, setEditTotalCopies, editAvailableCopies, setEditAvailableCopies}
}
