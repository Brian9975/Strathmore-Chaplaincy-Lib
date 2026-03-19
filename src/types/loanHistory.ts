import type { Status } from "./transaction"
import { Timestamp } from "firebase/firestore"

export interface LoanHistory {
    id: string,
    bookId: string,
    bookTitle: string,
    bookAuthor: string,
    name: string,
    stuOrStaffNo: number,
    contact: number,
    dueDate: Date,
    status: Status
    dateBorrowed: Timestamp,
    dateReturned: Timestamp,
}