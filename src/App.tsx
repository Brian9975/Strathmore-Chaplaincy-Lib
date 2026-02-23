import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/page";
import Admins from "./pages/admins/page";
import Books from "./pages/Books/page";
import Borrow from "./pages/Borrow/page";
import Login from "./pages/Auth/login";
import Returns from "./pages/returns/page";
import BookInfo from "./pages/BookInfo/page";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}

        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admins" element={<ProtectedRoute><Admins /></ProtectedRoute>} />
        <Route path="/books" element={<ProtectedRoute><Books/></ProtectedRoute>} />
        <Route path="/books/:id" element={<ProtectedRoute><BookInfo /></ProtectedRoute>} />
        <Route path="/borrow" element={<ProtectedRoute><Borrow /></ProtectedRoute>} />
        <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace/>} />

        {/* Redirect unknown paths to login */}

        <Route path="*" element={<Navigate to="/login" replace/>}/>
      </Routes>
    </Router>
  );
}

export default App;
