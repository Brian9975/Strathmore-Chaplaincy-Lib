import  {useState} from 'react'

export default function useIssueBook() {
    const [borrowerName, setBorrowerName] = useState("")
    const [stuOrStaffNo, setStuOrStaffNo] = useState("")
    const [borrowerEmail, setBorrowerEmail] = useState("")
    const [borrowerContact, setBorrowerContact] = useState("")
    const [dueDate, setDueDate] = useState<Date>(() => {
       const date = new Date()
       date.setDate(date.getDate() + 7)
       return date
    })

    const handleBookIssuance = (e: React.FormEvent<HTMLFormElement>, bookId: string) => {
      e.preventDefault()
    }
  return {handleBookIssuance, borrowerName, borrowerContact, borrowerEmail, stuOrStaffNo, dueDate, 
    setBorrowerContact, setStuOrStaffNo, setBorrowerName, setBorrowerEmail, setDueDate
  }
}
