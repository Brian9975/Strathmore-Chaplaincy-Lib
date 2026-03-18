import  {useState} from 'react'

export default function useIssueBook() {
    const [borrowerName, setBorrowerName] = useState("")
    const [stuOrStaffNo, setStuOrStaffNo] = useState(301603)
    const [borrowerContact, setBorrowerContact] = useState(712345678)
    const [dueDate, setDueDate] = useState<Date>(() => { 
       const date = new Date()
       date.setDate(date.getDate() + 7)
       return date
    })

    const handleBookIssuance = (e: React.FormEvent<HTMLFormElement>, bookId: string) => {
      e.preventDefault()
    }
  return {handleBookIssuance, borrowerName, borrowerContact, stuOrStaffNo, dueDate, 
    setBorrowerContact, setStuOrStaffNo, setBorrowerName, setDueDate
  }
}
