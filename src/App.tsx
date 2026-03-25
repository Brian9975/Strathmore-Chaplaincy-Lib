import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard/page";
import Admins from "./pages/admins/page";
import Books from "./pages/Books/page";
import Login from "./pages/Auth/login";
import TransactionsHistory from "./pages/transactionsHistory/page";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import ActiveTransactions from "./pages/activeTransactions/page";

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
        <Route path="/activeTransactions" element={<ProtectedRoute><ActiveTransactions /></ProtectedRoute>} />
        <Route path="/transactionsHistory" element={<ProtectedRoute><TransactionsHistory /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace/>} />

        {/* Redirect unknown paths to login */}

        <Route path="*" element={<Navigate to="/login" replace/>}/>
      </Routes>
    </Router>
  );
}

export default App;
