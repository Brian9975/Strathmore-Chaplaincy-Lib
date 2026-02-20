import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/page";
import Admins from "./pages/admins/page";
import Books from "./pages/Books/page";
import Borrow from "./pages/Borrow/page";
import Login from "./pages/Auth/login";
import Returns from "./pages/returns/page";
import Redirect from "./pages/Redirect/page";
import BookInfo from "./pages/BookInfo/page";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admins" element={<Admins />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:id" element={ <BookInfo/> }/>
        <Route path="/borrow" element={<Borrow />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Redirect />} />
      </Routes>
    </Router>
  );
}

export default App;
