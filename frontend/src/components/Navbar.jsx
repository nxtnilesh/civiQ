import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="text-primary"
              >
                <HelpCircle size={32} strokeWidth={2.5} />
              </motion.div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Civic<span className="text-primary">Voice</span></span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors font-medium">Map & Issues</Link>
            {user ? (
              <>
                <Link to="/report" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-600 transition shadow-sm font-medium">Report Issue</Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 transition font-medium">Logout ({user.username})</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary transition font-medium">Login</Link>
                <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-600 transition shadow-sm font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
