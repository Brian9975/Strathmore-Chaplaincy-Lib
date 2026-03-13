import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogClose, DialogFooter, DialogTitle

 } from "@/components/ui/dialog"
 import { FieldGroup, Field } from "@/components/ui/field"
 import { Label } from "@/components/ui/label"
 import { Input } from "@/components/ui/input"
 import { useStates } from "@/context/StatesContext"
import useAddNewBook from "@/hooks/useAddNewBook"
import { useEffect } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase-config"
import type { Book } from "@/types/book"
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table"
import { useAuth } from "@/context/AuthContext"


export default function Books() {
  const {openBookForm, setOpenBookForm, books, setBooks} = useStates()
  const {handleAddBook, title, setTitle, author, setAuthor, totalCopies, setTotalCopies, availableCopies, setAvailableCopies} = useAddNewBook()
  const {role} = useAuth()



  useEffect(() => {
    const booksCollectionRef = collection(db, "books")
  const unsubscribe = onSnapshot(booksCollectionRef, (snap) =>  {
     setBooks(snap.docs.map(doc => ({
      ...doc.data() as Book,
      id: doc.id

     })))
    return () => unsubscribe()
  })
  }, [])
  return (
     <div className="min-h-screen ">
      <div className="text-right px-2 pt-6">
        <Button onClick={() => setOpenBookForm(true)} className="bg-slate-800 cursor-pointer duration-1000 hover:bg-slate-700" variant={"default"}>Add Book</Button>
      </div>


            <div>
           {/* Dialog */}
               
             <Dialog open={openBookForm} onOpenChange={setOpenBookForm}>
                   <DialogContent className="sm:max-w-sm bg-slate-950 border-0">
                    <form onSubmit={handleAddBook}>
                <DialogHeader>
                  <DialogTitle className="text-slate-50">Fill Book Details</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Enter details for the new book
                </DialogDescription>
                <FieldGroup>
                  <Field>
                    <Label htmlFor="title" className="text-slate-50">Book Title</Label>
                    <Input id="title" value={title} onChange={e => setTitle(e.target.value)} type="text" className="text-slate-50" name="title" placeholder="Enter book title..." />
                  </Field>
                  <Field>
                    <Label className="text-slate-50" htmlFor="author">Author</Label>
                    <Input id="author" value={author} onChange={e => setAuthor(e.target.value)} className="text-slate-50"  type="text" name="author" placeholder="Enter book author..." />
                  </Field>
                  <Field>
                    <Label className="text-slate-50" htmlFor="total-copies">Total Copies</Label>
                    <Input id="total-copies" onChange={(e) => setTotalCopies(Number(e.target.value))} className="text-slate-50" type="number"  placeholder="Total copies..."/>
                  </Field>
                   <Field>
                    <Label className="text-slate-50" htmlFor="available-copies">Available Copies</Label>
                    <Input id="available-copies"  onChange={e => setAvailableCopies(Number(e.target.value))}  className="text-slate-50" type="number" name="available-copies" placeholder="Available copies..."/>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button className="cursor-pointer mt-3" variant="default">Cancel</Button>
                  </DialogClose>
                  <Button className="cursor-pointer mt-3" type="submit">Add</Button>
                </DialogFooter>
                   </form>
             </DialogContent>
               
              </Dialog>
            </div>


            {/* List of Books */}
              <div className="pt-5 text-white overflow-y-auto pb-10">
                <Table>
                  <TableCaption>List Of All Books</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Book Title</TableHead>
                      <TableHead className="text-white">Book Author</TableHead>
                      <TableHead className="text-white">Total Copies</TableHead>
                      <TableHead className=" text-white">Available Copies</TableHead>
                      <TableHead className="text-white text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell >{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.totalCopies}</TableCell>
                        <TableCell>{book.availableCopies}</TableCell>
                        <TableCell className="text-right">
                          <Button className="cursor-pointer text-slate-950" variant="outline">Edit Book</Button>
                         {role === "main_admin" && <Button className="ml-4 cursor-pointer">Delete Book</Button>} 
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            
                  </div>
            

     </div>
  )
}
