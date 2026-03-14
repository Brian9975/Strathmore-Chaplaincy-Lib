import { useStates } from '@/context/StatesContext'
import { doc, updateDoc } from 'firebase/firestore'
import React, {useState} from 'react'
import { db } from '@/lib/firebase-config'
import { useAuth } from '@/context/AuthContext'
export default function useEditBook() {
  
      const [editAuthor, setEditAuthor] = useState("")
      const [editTitle, setEditTitle] = useState("")
      const [editTotalCopies, setEditTotalCopies] = useState(1)
      const [editAvailableCopies, setEditAvailableCopies] = useState(0)
      const { setLoading} = useAuth()
      const {setBookToEdit} = useStates()


    const handleEditForm = async (e: React.FormEvent<HTMLFormElement>, editingId: string) => {
      e.preventDefault()
      if (!editTitle) {
        return
      } else if (!editAuthor) {
        return
      } else if (editTotalCopies < editAvailableCopies) {
        alert(`Total copies ${editTotalCopies} cannot be less than available copies ${editAvailableCopies}`)
      } else if (editTotalCopies <= 0) {
        alert(`Total copies ${editTotalCopies} cannot be less than or equal to 0`)
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
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
        setBookToEdit(null)
      }
 
    }
    }
  return {handleEditForm, editAuthor, setEditAuthor, editTitle, setEditTitle, editTotalCopies, setEditTotalCopies, editAvailableCopies, setEditAvailableCopies}
}
