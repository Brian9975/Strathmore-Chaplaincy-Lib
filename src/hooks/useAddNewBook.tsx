import { useAuth } from "@/context/AuthContext"
import { useStates } from "@/context/StatesContext"
import { db } from "@/lib/firebase-config"
import { addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import { toast } from "sonner"


export default function useAddNewBook() {
 const [title, setTitle] = useState("")
 const [author, setAuthor] = useState("")
 const [totalCopies, setTotalCopies] = useState(0)
 const [availableCopies, setAvailableCopies] = useState(0)
 const {setLoading} = useAuth()
 const {setOpenBookForm, books, setAlertAdd} = useStates()

 const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
             
 const existingBook = books.find(book => 
    book.title.toLowerCase() === title.toLowerCase()
 )
 if (existingBook) {
   toast.warning(`Book with title "${existingBook.title}" already exists`)
return
 }


    if (!title) {
        toast.warning("Please fill the title field", {position: "top-center"})
        return
    } else if (!author) {
        toast.warning("Please fill the author field", {position: "top-center"})
        return
    } 

    else if (!totalCopies) {
      toast.warning("Please include the total number of copies", {position: "top-center"})
      return
    }
      else if (!availableCopies) {
      toast.warning("Please include the available number of copies", {position: "top-center"})
      return
    }
         else if (totalCopies < availableCopies) {
        toast.warning(`Total copies ${totalCopies} cannot be less than available copies ${availableCopies}`, {position: "top-center"})
        return
      } else if (totalCopies <= 0) {
        toast.warning(`Total copies ${totalCopies} cannot be less than or equal to 0`, {position: "top-center"})
        return
      } else if (availableCopies < 0) {
        toast.warning(`Available copies ${availableCopies} cannot be less than 0`, {position: "top-center"})
        return
      }   

    else {
     setLoading(true)
    try {
        await addDoc(collection(db, "books"), {
            title: title,
            author: author,
            totalCopies: totalCopies,
            availableCopies: availableCopies,
        })
        setAlertAdd(true)
        setTimeout(() => {
            setAlertAdd(false)
        }, 6000)
    } catch (error) {
      toast.error(`Error while adding book ${error}`, {position: "top-center"})
    } finally {
        setLoading(false)
        setOpenBookForm(false)
    }
}
 }



  return {handleAddBook, title, setTitle, author, setAuthor, totalCopies, setTotalCopies, availableCopies, setAvailableCopies}
}
