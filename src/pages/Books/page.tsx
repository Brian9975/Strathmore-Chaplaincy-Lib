import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup, Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useStates } from "@/context/StatesContext";
import useAddNewBook from "@/hooks/useAddNewBook";
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import type { Book } from "@/types/book";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import useEditBook from "@/hooks/useEditBook";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Edit, CheckCircleIcon, CalendarIcon, CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import useDeleteBook from "@/hooks/useDeleteBook";
import { Skeleton } from "@/components/ui/skeleton";
import useIssueBook from "@/hooks/useIssueBook";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import useBrandTheme from "@/hooks/useBrandTheme"

export default function Books() {
  const {brandThemes} = useBrandTheme()
  const [searchTerm, setSearchTerm] = useState("");
  const {
    openBookForm,
    bookToIssue,
    setBookToIssue,
    setOpenBookForm,
    books,
    setBooks,
    bookToEdit,
    setBookToEdit,
    alertEdit,
    alertAdd,
    bookToDelete,
    setBookToDelete,
    alertDel,
    alertIssue
  } = useStates();
  const {
    handleAddBook,
    title,
    setTitle,
    author,
    setAuthor,
    availableCopies,
    totalCopies,
    setTotalCopies,
    setAvailableCopies,
  } = useAddNewBook();
  const { role } = useAuth();
  const [booksLoad, setBooksLoad] = useState(true);
  const {
    handleEditForm,
    editTitle,
    setEditTitle,
    editAuthor,
    setEditAuthor,
    editTotalCopies,
    setEditTotalCopies,
    editAvailableCopies,
    setEditAvailableCopies,
  } = useEditBook();
  const { handleDeleteBook } = useDeleteBook();
  const bookToEditInfo = books.find((book) => book.id === bookToEdit);
  const bookToDelInfo = books.find((book) => book.id === bookToDelete);

  const {
    handleBookIssuance,
    borrowerName,
    borrowerContact,
    stuOrStaffNo,
    dueDate,
    setBorrowerContact,
    setStuOrStaffNo,
    setBorrowerName,
    setDueDate,
  } = useIssueBook();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const availGreatTotal = availableCopies > totalCopies;
  const availLessZero = availableCopies < 0;
  const totalLessEqualZero = totalCopies <= 0;

  const editAvailGreatTotal = editAvailableCopies > editTotalCopies;
  const editAvailLessZero = editAvailableCopies < 0;
  const editTotalLessEqualZero = editTotalCopies <= 0;

  const noTitle = !title;
  const noAuthor = !author;
  const noTotalCopies = !totalCopies;
  const noAvailableCopies = !availableCopies;

  const noEditTitle = !editTitle;
  const noEditAuthor = !editAuthor;

  const existingBook = books.find(
    (book) => book.title.toLowerCase() === title.toLowerCase(),
  );

  useEffect(() => {
    if (bookToEditInfo) {
      setEditAuthor(bookToEditInfo.author);
      setEditTitle(bookToEditInfo.title);
      setEditTotalCopies(bookToEditInfo.totalCopies);
      setEditAvailableCopies(bookToEditInfo.availableCopies);
    }
  }, [bookToEditInfo]);

  useEffect(() => {
    const booksCollectionRef = collection(db, "books");

    const q = query(booksCollectionRef, orderBy("title", "asc"));

    const unsubscribe = onSnapshot(q, (snap) => {
      setBooks(
        snap.docs.map((doc) => ({
          ...(doc.data() as Book),
          id: doc.id,
        })),
      );
      setBooksLoad(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="min-h-screen">
      <h1 className="font-bold p-4 text-2xl">Books</h1>
      <div className="text-right px-2 pt-6 mb-7">
        <Button
          onClick={() => setOpenBookForm(true)}
          className={`bg-button-2 dark:text-[#F5F0DA] cursor-pointer duration-1000 hover:bg-button-1`}
          variant={"default"}
        >
          Add Book
        </Button>
      </div>

      {/* Search Filter For Books */}
     { books.length !== 0 && <div className="flex mb-4 justify-center">
        <Input
          type="text"
          value={searchTerm}
          className="w-xl"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search book by title/author..."
        />
      </div>}
      <div>
        {/* Dialog */}

        <Dialog open={openBookForm} onOpenChange={setOpenBookForm}>
          <DialogContent className="sm:max-w-sm dark:bg-primary-background bg-[#FAF8F0] border-0">
            <form onSubmit={handleAddBook}>
              <DialogHeader>
                <DialogTitle className="dark:text-secondary-text">
                  Fill Book Details
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Enter details for the new book
              </DialogDescription>
              <FieldGroup>
                <Field>
                  <Label htmlFor="title" className="dark:text-secondary-text">
                    Book Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    className={`dark:text-secondary-text ${noTitle ? "border-error focus-visible:ring-error text-error " : ""}`}
                    name="title"
                    placeholder="Enter book title..."
                  />
                  {noTitle && (
                    <p className="text-xs text-error">
                      Required! Please fill the title field
                    </p>
                  )}
                  {existingBook && (
                    <p className="text-xs text-error">
                      Book with title "{existingBook.title}" already exists!!
                    </p>
                  )}
                </Field>
                <Field>
                  <Label className="dark:text-secondary-text" htmlFor="author">
                    Author
                  </Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className={`dark:text-secondary-text ${noAuthor ? "border-error focus-visible:ring-error text-error " : ""}`}
                    type="text"
                    name="author"
                    placeholder="Enter book author..."
                  />
                  {noAuthor && (
                    <p className="text-error text-xs">
                      Required! Please fill the author field
                    </p>
                  )}
                </Field>
                <Field>
                  <Label className="dark:text-secondary-text" htmlFor="total-copies">
                    Total Copies
                  </Label>
                  <Input
                    id="total-copies"
                    onChange={(e) => setTotalCopies(Number(e.target.value))}
                    className={`dark:text-secondary-text ${totalLessEqualZero || noTotalCopies ? "border-error focus-visible:ring-error text-error " : ""}`}
                    type="number"
                    placeholder="Total copies..."
                  />
                  {totalLessEqualZero && (
                    <p className="text-error text-xs">
                      Total copies can't be less or equal to 0
                    </p>
                  )}
                  {noTotalCopies && (
                    <p className="text-error text-xs">
                      Required! Please include the total number of copies
                    </p>
                  )}
                </Field>
                <Field>
                  <Label className="dark:text-secondary-text" htmlFor="available-copies">
                    Available Copies
                  </Label>
                  <Input
                    id="available-copies"
                    onChange={(e) => setAvailableCopies(Number(e.target.value))}
                    className={`dark:text-secondary-text ${availGreatTotal || availLessZero || noAvailableCopies ? "border-error text-error focus-visible:ring-error" : ""}`}
                    type="number"
                    name="available-copies"
                    placeholder="Available copies..."
                  />
                  {availGreatTotal && (
                    <p className="text-error text-xs">
                      Available copies can't be greater than total copies
                    </p>
                  )}
                  {availLessZero && (
                    <p className="text-error text-xs">
                      Available copies can't be less than 0
                    </p>
                  )}
                  {noAvailableCopies && (
                    <p className="text-error text-xs">
                      Required! Please include the available number of copies
                    </p>
                  )}
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className={`bg-warn font-bold text-[#F5F0DA] cursor-pointer duration-1000 hover:bg-highlights mt-3`} >
                    Cancel
                  </Button>
                </DialogClose>
                <Button  className={`bg-button-2 font-bold dark:text-[#F5F0DA] cursor-pointer duration-1000 hover:bg-button-1 mt-3`} type="submit" >
                  Add
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* List of Books */}
      <div className="pt-5 dark:text-secondary-text text-[#1C1A17] overflow-y-auto pb-10">
        {booksLoad ? (
          <div className="flex w-full p-4 flex-col gap-2">
            {Array.from({ length: 100 }).map((_, index) => (
              <div className="flex gap-4" key={index}>
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-10" />
                <Skeleton className="h-9 w-20" />
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col justify-center gap-5 items-center">
            <Button
              onClick={() => setOpenBookForm(true)}
              className="bg-button-2 text-[#F5F0DA] font-bold text-lg hover:bg-button-1 cursor-pointer w-70 h-20 duration-1000"
              variant={"default"}
            >
              Add Book
            </Button>
            <div>
              <p className="text-[#1C1A17] dark:text-[#FAF8F0] text-md  sm:text-xl md:text-2xl">
                There are no books currently!! Please click the "Add Book"
                button
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableCaption>List Of All Books</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-warn font-bold md:text-lg text-md ">Book Title</TableHead>
                <TableHead className="text-warn font-bold md:text-lg text-md ">Book Author</TableHead>
                <TableHead className="text-warn font-bold md:text-lg text-md ">Total Copies</TableHead>
                <TableHead className=" text-warn font-bold md:text-lg text-md ">Available Copies</TableHead>

                <TableHead className="text-warn font-bold md:text-lg text-md  text-left">Action</TableHead>

                <TableHead className="text-warn font-bold md:text-lg text-md  text-right">Issue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="dark:text-[#F5F0DA] text-[#1C1A17]">
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.totalCopies}</TableCell>
                  <TableCell>{book.availableCopies}</TableCell>

                  <TableCell className="">
                    <Button
                      className="cursor-pointer bg-warn hover:bg-warn hover:opacity-80"
                      onClick={() => setBookToEdit(book.id)}
                      variant="outline"
                    >
                      Edit
                    </Button>
                    {role === "main_admin" && (
                      <Button
                        onClick={() => setBookToDelete(book.id)}
                        className="ml-4 cursor-pointer dark:bg-[#FAF8F0] bg-[#1C1A17] hover:bg-[#1C1A17] dark:hover:bg-[#FAF8F0] hover:opacity-80"
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => setBookToIssue(book.id)}
                      className=" cursor-pointer hover:text-[#1C1A17] dark:text-[#1C1A17] dark:bg-button-1 dark:hover:bg-button-1 bg-button-1 font-bold hover:bg-button-1 hover:opacity-95 border-none "
                      variant="outline"
                    >
                      Issue Book
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit Book Dialog */}
      <div>
        {/* Dialog */}

        <Dialog open={!!bookToEdit} onOpenChange={() => setBookToEdit(null)}>
          <DialogContent className="sm:max-w-sm 0 bg-[#FAF8F0] dark:bg-primary-background dark:text-secondary-text border-0">
            <form
              onSubmit={(e) => {
                if (bookToEdit !== null) {
                  handleEditForm(e, bookToEdit);
                }
              }}
            >
              <DialogHeader>
                <DialogTitle>
                  Edit Book Details
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="p-3">
                Enter details you want to edit the book to.
              </DialogDescription>
              <FieldGroup>
                <Field>
                  <Label htmlFor="title" className="pt-2 ">
                    Book Title
                  </Label>
                  <Input
                    id="title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    type="text"
                    className={` ${noEditTitle ? "border-error focus-visible:ring-error text-error " : ""}`}
                    name="title"
                    placeholder="Enter book title..."
                  />
                  {noEditTitle && (
                    <p className="text-xs text-error">
                      Required! Please fill the title field
                    </p>
                  )}
                </Field>
                <Field>
                  <Label htmlFor="author">
                    Author
                  </Label>
                  <Input
                    id="author"
                    value={editAuthor}
                    onChange={(e) => setEditAuthor(e.target.value)}
                    className={` ${noEditAuthor ? "border-error focus-visible:ring-error text-error " : ""}`}
                    type="text"
                    name="author"
                    placeholder="Enter book author..."
                  />
                  {noEditAuthor && (
                    <p className="text-error text-xs">
                      Required! Please fill the author field
                    </p>
                  )}
                </Field>
                <Field>
                  <Label htmlFor="total-copies">
                    Total Copies
                  </Label>
                  <Input
                    id="total-copies"
                    value={editTotalCopies}
                    onChange={(e) => setEditTotalCopies(Number(e.target.value))}
                    className={`${editTotalLessEqualZero ? "focus-visible:ring-error text-error border-error" : ""}`}
                    type="number"
                    placeholder="Total copies..."
                  />
                  {editTotalLessEqualZero && (
                    <p className="text-error text-xs">
                      Total copies can't be less or equal to 0
                    </p>
                  )}
                </Field>
                <Field>
                  <Label  htmlFor="available-copies">
                    Available Copies
                  </Label>
                  <Input
                    id="available-copies"
                    className={`${editAvailGreatTotal ? "border-error focus-visible:ring-error text-error" : ""}`}
                    value={editAvailableCopies}
                    onChange={(e) =>
                      setEditAvailableCopies(Number(e.target.value))
                    }
                    type="number"
                    name="available-copies"
                    placeholder="Available copies..."
                  />
                  {editAvailGreatTotal && (
                    <p className="text-error text-xs">
                      Available copies can't be greater than total copies
                    </p>
                  )}
                  {editAvailLessZero && (
                    <p className="text-error text-xs">
                      Available copies can't be less than 0
                    </p>
                  )}
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="cursor-pointer bg-primary-background hover:bg-primary-backgroud hover:opacity-80 font-bold  mt-3" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button className="cursor-pointer font-bold bg-button-2 hover:bg-button-1  dark:bg-[#FAF8F0] mt-3" type="submit">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="fixed right-4 bottom-4">
        {alertEdit && (
          <Alert className="max-w-md">
            <Edit />
            <AlertTitle className="text-md">
              Book Edited Successfully
            </AlertTitle>
          </Alert>
        )}
      </div>

      <div className="fixed right-4 bottom-4">
        {alertAdd && (
          <Alert className="max-w-md">
            <CheckCircleIcon color="green" />
            <AlertTitle className="text-md">
              New Book Added Successfully
            </AlertTitle>
          </Alert>
        )}
      </div>

      <AlertDialog
        open={!!bookToDelete}
        onOpenChange={() => setBookToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately delete the book "{bookToDelInfo?.title}"
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer  hover:opacity-80 dark:bg-[#FAF8F0]"
              onClick={() => {
                if (bookToDelete !== null) {
                  handleDeleteBook(bookToDelete);
                  setBookToDelete(null);
                }
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="fixed right-4 bottom-4">
        {alertDel && (
          <Alert className="max-w-md">
            <CheckCircleIcon color="red" />
            <AlertTitle className="text-md">Book Deletion Completed</AlertTitle>
          </Alert>
        )}
      </div>

      {/* Issue Book Dialog */}

      <div>
        {/* Dialog */}

        <Dialog open={!!bookToIssue} onOpenChange={() => setBookToIssue(null)}>
          <DialogContent className="sm:max-w-sm bg-[#FAF8F0]  text-[#1C1A17] dark:bg-primary-background dark:text-[#FAF8F0] border-0">
            <form
              onSubmit={(e) => {
                if (bookToIssue !== null) {
                  handleBookIssuance(e, bookToIssue);
                }
              }}
            >
              <DialogHeader>
                <DialogTitle className="p-3">
                  Borrower's Details
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Fill The Following Fields To Issue Book
              </DialogDescription>
              <FieldGroup>
                <Field>
                  <Label htmlFor="borrower-name" className="p-2">
                    Borower's Name
                  </Label>
                  <Input
                    id="borrower-name"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    type="text"
                    name="name"
                    placeholder="eg.John Doe ...."
                  />
                </Field>

                <Field>
                  <Label  htmlFor="s-no">
                    Student/Staff No.
                  </Label>
                  <Input
                    id="s-no"
                    onChange={(e) => setStuOrStaffNo(Number(e.target.value))}
                   
                    type="number"
                    placeholder="eg.123456..."
                  />
                </Field>
                <Field>
                  <Label htmlFor="contact">
                    Borrower's Contact
                  </Label>
                  <Input
                    id="contact"
                  
                    onChange={(e) => setBorrowerContact(Number(e.target.value))}
                    type="number"
                    name="available-copies"
                    placeholder="eg.712345678..."
                  />
                </Field>

                <Field>
                  <Label htmlFor="date-due">
                    Date Due
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        data-empty={!dueDate}
                        className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                      >
                        <CalendarIcon />
                        {dueDate ? (
                          format(dueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => setDueDate(date as Date)}
                        disabled={(date) => { 
                          let today = new Date()
                          today.setHours(0, 0, 0, 0)
                          return date < today
                        }
                        }
                        required
                      />
                    </PopoverContent>
                  </Popover>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button className="cursor-pointer border-2 border-[#1C1A17] mt-3" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant={"default"} className="cursor-pointer mt-3" type="submit">
                  Issue Book
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert after issuing book */}
      <div className="fixed right-4 bottom-4 ">
        {alertIssue && (
          <Alert className="max-w-md">
            <CheckCircle2 color="green" />
            <AlertTitle className="text-md">
              Book issued successfully
            </AlertTitle>
          </Alert>
        )}
      </div>
    </div>
  );
}
