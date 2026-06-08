import { Link } from 'react-router-dom';
import { useAuth } from '../authcontext.jsx';
import { useCart } from '../pages/cart'; // Hook into the cart logic located in your pages folder

export default function Navbar() {
  const { role } = useAuth();
  const { cart } = useCart(); // Get the current cart state

  // Calculate the total number of items in the cart
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="flex justify-between items-center p-4 bg-black text-white shadow-md sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="font-black text-2xl tracking-tighter uppercase">
        ☕ cafe
      </div>

      {/* Navigation Links */}
      <div className="flex gap-8 items-center font-bold text-sm uppercase tracking-widest">
        <Link to="/" className="hover:text-orange-500 transition">
          Menu
        </Link>
        
        {/* Cart Link with Dynamic Badge */}
        <Link to="/cart" className="relative group">
          <span className="hover:text-orange-500 transition">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-3 -right-4 bg-orange-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-black">
              {totalItems}
            </span>
          )}
        </Link>

        <Link to="/help" className="hover:text-orange-500 transition">
          Help
        </Link>

        {/* Conditional Rendering based on Role */}
        {(role === 'staff' || role === 'admin') ? (
          <Link 
            to="/staff" 
            className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition shadow-lg shadow-orange-900/20"
          >
            Dashboard
          </Link>
        ) : (
          <Link to="/login" className="text-gray-500 hover:text-white transition text-xs normal-case">
            Staff Login
          </Link>
        )}
      </div>
    </nav>
  );
}