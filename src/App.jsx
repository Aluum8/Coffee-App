import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authcontext"; 
import { CartProvider } from "./pages/cart"; // Import the Provider (the logic)
import Menu from "./pages/menu";
import Login from "./pages/login";
import StaffDashboard from "./pages/staffdashboard";
import CartPage from './pages/cart'; // Import the Page (the UI)

export default function App() {
  return (
    <AuthProvider>
      {/* We use CartProvider here. 
          It must be OUTSIDE the Router so the cart data doesn't 
          disappear when the URL changes.
      */}
      <CartProvider> 
        <Router>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}