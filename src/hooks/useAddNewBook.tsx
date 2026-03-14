import { useAuth } from "@/context/AuthContext"
import { useStates } from "@/context/StatesContext"
import { db } from "@/lib/firebase-config"
import { addDoc, collection } from "firebase/firestore"
import { useState } from "react"


export default function useAddNewBook() {
 const [title, setTitle] = useState("")
 const [author, setAuthor] = useState("")
 const [totalCopies, setTotalCopies] = useState(1)
 const [availableCopies, setAvailableCopies] = useState(0)
 const {setLoading} = useAuth()
 const {setOpenBookForm} = useStates()

 const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
   

    if (!title) {
        alert("please fill the title field")
    } else if (!author) {
        alert("please fill the author field")
    } 
         else if (totalCopies < availableCopies) {
        alert(`Total copies ${totalCopies} cannot be less than available copies ${availableCopies}`)
      } else if (totalCopies <= 0) {
        alert(`Total copies ${totalCopies} cannot be less than or equal to 0`)
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
    } catch (error) {
      console.log(error)  
    } finally {
        setLoading(false)
        setOpenBookForm(false)
    }
}
 }



  return {handleAddBook, title, setTitle, author, setAuthor, totalCopies, setTotalCopies, availableCopies, setAvailableCopies}
}
