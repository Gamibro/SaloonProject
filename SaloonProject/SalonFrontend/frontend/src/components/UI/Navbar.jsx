// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FiScissors, FiMenu, FiX } from 'react-icons/fi';
// import { useAuth } from '../../auth/AuthContext';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user, logout } = useAuth();

//   return (
//     <nav className="bg-gray-800 px-6 py-4 shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         <Link to="/" className="flex items-center space-x-2">
//           <FiScissors className="text-purple-500 text-2xl" />
//           <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
//             Elegance Salon
//           </span>
//         </Link>
        
//         {/* Desktop Navigation */}
//         <div className="hidden md:flex space-x-8 items-center">
//           <Link to="/" className="hover:text-purple-400 transition">Home</Link>
//           <Link to="/services" className="hover:text-purple-400 transition">Services</Link>
//           <Link to="/stylists" className="hover:text-purple-400 transition">Stylists</Link>
//           {user && <Link to="/bookings" className="hover:text-purple-400 transition">My Bookings</Link>}
//           <Link to="/portfolio" className="hover:text-purple-400 transition">Portfolio</Link>
          
//           {user ? (
//             <button 
//               onClick={logout}
//               className="text-gray-300 hover:text-red-400 transition"
//             >
//               Logout
//             </button>
//           ) : (
//             <Link to="/login" className="hover:text-purple-400 transition">Login</Link>
//           )}
//         </div>
        
//         {/* Mobile Menu Button */}
//         <button 
//           className="md:hidden text-gray-300 hover:text-white focus:outline-none"
//           onClick={() => setIsOpen(!isOpen)}
//         >
//           {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
//         </button>
//       </div>
      
//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="md:hidden mt-4 pb-4 space-y-3">
//           <Link to="/" className="block hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Home</Link>
//           <Link to="/services" className="block hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Services</Link>
//           <Link to="/stylists" className="block hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Stylists</Link>
//           {user && <Link to="/bookings" className="block hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>My Bookings</Link>}
//           <Link to="/portfolio" className="block hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Portfolio</Link>
          
//           {user ? (
//             <button 
//               onClick={() => {
//                 logout();
//                 setIsOpen(false);
//               }}
//               className="block text-gray-300 hover:text-red-400 transition w-full text-left"
//             >
//               Logout
//             </button>
//           ) : (
//             <Link to="/login" className="block hover:text-purple-400 transition" onClick={() => setIsOpen(false)}>Login</Link>
//           )}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiScissors, 
  FiMenu, 
  FiX, 
  FiCalendar,
  FiHome,
  FiUsers,
  FiImage,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiBookmark
} from 'react-icons/fi';
import { useAuth } from '../../auth/AuthContext';
import Swal from 'sweetalert2';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out from your account.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#f3f4f6',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };

  // Scroll to top helper function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setIsOpen(false); // Close mobile menu on navigation
  };

  // Main navigation items
  const navItems = [
    { path: "/", name: "Home", icon: <FiHome size={18} /> },
    { path: "/services", name: "Services", icon: <FiScissors size={18} /> },
    { path: "/stylists", name: "Stylists", icon: <FiUsers size={18} /> },
    // { path: "/book-now", name: "Book Now", icon: <FiCalendar size={18} /> },
    { path: "/portfolio", name: "Gallery", icon: <FiImage size={18} /> },
  ];

  // Auth-related items
  const authItems = user
    ? [
        { path: "/bookings", name: "My Bookings", icon: <FiBookmark size={18} /> },
        { path: "/book-now", name: "Book Now", icon: <FiCalendar size={18} /> },
        { action: handleLogout, name: "Logout", icon: <FiLogOut size={18} /> }
      ]
    : [
        { path: "/login", name: "Login", icon: <FiLogIn size={18} /> },
        { path: "/login?mode=signup", name: "Sign Up", icon: <FiUserPlus size={18} /> }
      ];

  return (
    <nav className="bg-white/5 backdrop-blur-lg border-b border-gray-800 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Branding */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 group"
          onClick={scrollToTop}
        >
          <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg group-hover:rotate-12 transition-transform shadow-lg">
            <FiScissors className="text-white text-lg" />
          </div>
          <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Elegance Salon
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {/* Main Navigation */}
          <div className="flex items-center space-x-1 mr-8">
            {navItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                icon={item.icon}
                text={item.name}
                onClick={scrollToTop}
              />
            ))}
          </div>
          
          {/* Separator */}
          <div className="h-8 w-px bg-gray-700 mx-2"></div>
          
          {/* Auth Navigation - Right Aligned */}
          <div className="flex items-center space-x-2">
            {authItems.map((item) => item.path ? (
              <AuthLink 
                key={item.path}
                to={item.path}
                icon={item.icon}
                text={item.name}
                isSignup={item.name === "Sign Up"}
                onClick={scrollToTop}
              />
            ) : (
              <AuthButton
                key={item.name}
                onClick={item.action}
                icon={item.icon}
                text={item.name}
              />
            ))}
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-gray-300 hover:text-white focus:outline-none rounded-lg hover:bg-gray-700/50 transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 pb-4 space-y-2 px-2">
          {/* Main Links */}
          <div className="space-y-1">
            {navItems.map((item) => (
              <MobileLink
                key={item.path}
                to={item.path}
                icon={item.icon}
                text={item.name}
                onClick={scrollToTop}
              />
            ))}
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gray-700 my-2"></div>
          
          {/* Auth Links */}
          <div className="space-y-1">
            {authItems.map((item) => item.path ? (
              <MobileLink
                key={item.path}
                to={item.path}
                icon={item.icon}
                text={item.name}
                onClick={scrollToTop}
                isSignup={item.name === "Sign Up"}
              />
            ) : (
              <MobileButton
                key={item.name}
                onClick={() => {
                  item.action();
                  setIsOpen(false);
                }}
                icon={item.icon}
                text={item.name}
              />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

// Updated Link Components with scroll-to-top
const NavLink = ({ to, icon, text, onClick }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 text-gray-300 hover:text-white transition rounded-lg group"
    onClick={onClick}
  >
    <span className="text-purple-400 group-hover:text-pink-400 transition-colors">
      {icon}
    </span>
    <span className="ml-2 font-bold">{text}</span>
  </Link>
);

const AuthLink = ({ to, icon, text, isSignup, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-lg transition ${
      isSignup
        ? 'bg-gradient-to-r from-purple-600/80 to-pink-500/80 text-white hover:shadow-lg hover:shadow-purple-500/20'
        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {text}
  </Link>
);


const AuthButton = ({ onClick, icon, text }) => (
  <button
    onClick={onClick}
    className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition rounded-lg"
  >
    <span className="mr-2">{icon}</span>
    {text}
  </button>
);

const MobileLink = ({ to, icon, text, onClick, isSignup }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center px-4 py-3 rounded-lg transition ${
      isSignup
        ? 'bg-gradient-to-r from-purple-600/80 to-pink-500/80 text-white hover:shadow-lg hover:shadow-purple-500/20'
        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
    }`}
  >
    <span className="mr-3">{icon}</span>
    {text}
  </Link>
);

const MobileButton = ({ onClick, icon, text }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 transition rounded-lg text-left"
  >
    <span className="mr-3">{icon}</span>
    {text}
  </button>
);

export default Navbar;