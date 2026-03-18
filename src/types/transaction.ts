import type { Timestamp } from "firebase/firestore"


type Status = "issued" | "overdue" | "returned"
export interface Transaction {
    transactionId: string,
    bookId: string,
    bookTitle: string,
    bookAuthor: string,
    name: string,
    stuOrStaffNo: number,
    contact: number,
    dueDate: Date,
    status: Status
    dateBorrowed: Timestamp,
}