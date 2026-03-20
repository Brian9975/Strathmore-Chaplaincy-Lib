

export default function useLoanOverdue() {
 const loanIsOverdue = (dueDate: any) => {
       if (!dueDate) {
         return false
       }
 
    let date: Date;
   
   if (typeof dueDate.toDate === 'function') {
     // It's a Firestore Timestamp
     date = dueDate.toDate();
   } else if (dueDate instanceof Date) {
     // It's already a JS Date
     date = dueDate;
   } else if (dueDate.seconds) {
     // It's a plain object with seconds (Firestore data that lost its methods)
     date = new Date(dueDate.seconds * 1000);
   } else {
     // It's a string or something else
     date = new Date(dueDate);
   }
 
       const today = new Date()
 
       today.setHours(0, 0, 0, 0)
       date.setHours(0, 0, 0, 0)
   
       return today > date
     }
  return {loanIsOverdue}
}
