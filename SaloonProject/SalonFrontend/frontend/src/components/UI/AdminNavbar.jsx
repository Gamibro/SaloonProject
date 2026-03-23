import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  FiScissors,
  FiLogOut,
  FiHome,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiFileText,
  FiServer,
  FiPackage,
  FiLogout,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Swal from "sweetalert2";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from the admin panel.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed", // purple-600
      cancelButtonColor: "#6b7280", // gray-500
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
      background: "#1f2937", // gray-800
      color: "#f3f4f6", // gray-100
    }).then((result) => {
      if (result.isConfirmed) {
        setIsOpen(false);
        logout();
      }
    });
  };

  const closeAndScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const items = [
    { to: "/admin", icon: <FiHome className="mr-2" />, label: "Dashboard" },
    {
      to: "/admin/appointments",
      icon: <FiCalendar className="mr-2" />,
      label: "Appointments",
    },
    {
      to: "/admin/services",
      icon: <FiPackage className="mr-2" />,
      label: "Services",
    },
    { to: "/admin/staff", icon: <FiUsers className="mr-2" />, label: "Staff" },
    {
      to: "/admin/invoice",
      icon: <FiFileText className="mr-2" />,
      label: "Invoice Generation",
    },
    {
      to: "/admin/settings",
      icon: <FiSettings className="mr-2" />,
      label: "Settings",
    },
  ];

  return (
    <nav className="bg-gray-800 px-6 py-3 shadow-lg sticky top-0 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/admin"
          className="flex items-center space-x-2"
          onClick={closeAndScrollTop}
        >
          <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg shadow-lg">
            <FiScissors className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Salon Admin
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-6">
          {items.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center text-gray-300 hover:text-purple-400 transition px-2 py-2 rounded-lg hover:bg-gray-700/40"
            >
              {icon}
              {label}
            </Link>
          ))}

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-red-400 transition px-2 py-2 rounded-lg hover:bg-gray-700/40"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-700/50 transition"
          onClick={() => setIsOpen((s) => !s)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-3 pb-3 space-y-1">
          {/* Links */}
          <div className="space-y-1">
            {items.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeAndScrollTop}
                className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition"
              >
                {icon}
                {label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-700 my-2" />

          {/* Logout */}
          {user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg text-left transition"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
    // <nav className="bg-gray-800 px-6 py-4 shadow-lg sticky top-0 z-50">
    //   <div className="max-w-7xl mx-auto flex justify-between items-center">
    //     <Link to="/admin" className="flex items-center space-x-2">
    //       <FiScissors className="text-purple-500 text-2xl" />
    //       <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
    //         Salon Admin
    //       </span>
    //     </Link>

    //     <div className="flex items-center space-x-6">
    //       <Link to="/admin" className="flex items-center text-gray-300 hover:text-purple-400 transition">
    //         <FiHome className="mr-1" /> Dashboard
    //       </Link>
    //       <Link to="/admin/appointments" className="flex items-center text-gray-300 hover:text-purple-400 transition">
    //         <FiCalendar className="mr-1" /> Appointments
    //       </Link>

    //       <Link to="/admin/services" className="flex items-center text-gray-300 hover:text-purple-400 transition">
    //         <FiPackage className="mr-1" /> Services
    //       </Link>

    //       <Link to="/admin/staff" className="flex items-center text-gray-300 hover:text-purple-400 transition">
    //         <FiUsers className="mr-1" /> Staff
    //       </Link>

    //        <Link to="/admin/invoice" className="flex items-center text-gray-300 hover:text-purple-400 transition">
    //         <FiFileText className="mr-1" /> Invoice Generation
    //       </Link>
    //       <Link to="/admin/settings" className="flex items-center text-gray-300 hover:text-purple-400 transition">
    //         <FiSettings className="mr-1" /> Settings
    //       </Link>

    //       {user && (
    //         <button
    //           onClick={handleLogout}
    //           className="flex items-center text-gray-300 hover:text-red-400 transition"
    //         >
    //           <FiLogOut className="mr-1" /> Logout
    //         </button>
    //       )}
    //     </div>
    //   </div>
    // </nav>
  );
};

export default AdminNavbar;
