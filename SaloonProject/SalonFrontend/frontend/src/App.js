// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './auth/AuthContext';
// import Navbar from './components/UI/Navbar';
// import AdminNavbar from './components/UI/AdminNavbar';
// import Footer from './components/UI/Footer';

// import Home from './pages/public/Home';
// import Services from './pages/public/Services';
// import Stylists from './pages/public/Stylists';
// import Bookings from './pages/public/Bookings';
// import Portfolio from './pages/public/Portfolio';
// import AddBooking from './pages/public/AddBooking';

// import LoginPage from './pages/Login';

// import AdminDashboard from './pages/admin/Dashboard';
// import AdminAppointments from './pages/admin/Appointments';
// import AdminStaff from './pages/admin/Staff';
// import AdminSettings from './pages/admin/Settings';
// import ChatBot from './ChatBot';

// function PrivateRoute({ children, adminOnly = false }) {
//   const { user, isAdmin } = useAuth();

//   if (!user) {
//     // Not logged in at all
//     return <Navigate to="/login" replace />;
//   }

//   if (adminOnly && !isAdmin) {
//     // Logged in but not admin, trying to access admin route
//     return <Navigate to="/" replace />;
//   }

//   return children;
// }

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//        <ChatBot />
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/login" element={<LoginPage />} />

//           {/* User Protected Route */}
//           <Route
//             path="/bookings"
//             element={
//               <PrivateRoute>
//                 <Navbar />
//                 <main className="flex-grow">
//                   <Bookings />
//                 </main>
//                 <Footer />
//               </PrivateRoute>
//             }
//           />

//           {/* Admin Protected Routes */}
//           <Route
//             path="/admin/*"
//             element={
//               <PrivateRoute adminOnly>
//                 <AdminNavbar />
//                 <main className="flex-grow">
//                   <Routes>
//                     <Route index element={<AdminDashboard />} />
//                     <Route path="dashboard" element={<AdminDashboard />} />
//                     <Route path="appointments" element={<AdminAppointments />} />
//                     <Route path="staff" element={<AdminStaff />} />
//                     <Route path="settings" element={<AdminSettings />} />
//                   </Routes>
//                 </main>
//               </PrivateRoute>
//             }
//           />

//           {/* Main Public Layout */}
//           <Route
//             path="/*"
//             element={
//               <>
//                 <Navbar />
//                 <main className="flex-grow">
//                   <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="services" element={<Services />} />
//                     <Route path="stylists" element={<Stylists />} />
//                     <Route path="portfolio" element={<Portfolio />} />
//                     <Route path="book-now" element={<AddBooking />} />
//                   </Routes>
//                 </main>
//                 <Footer />
//               </>
//             }
//           />

//           {/* Catch-all route */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Navbar from './components/UI/Navbar';
import AdminNavbar from './components/UI/AdminNavbar';
import Footer from './components/UI/Footer';
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import Stylists from './pages/public/Stylists';
import Bookings from './pages/public/Bookings';
import Portfolio from './pages/public/Portfolio';
import AddBooking from './pages/public/AddBooking';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminStaff from './pages/admin/Staff';
import AdminSettings from './pages/admin/Settings';
import AdminServicesPage from './pages/admin/AdminServices';
import ChatBot from './ChatBot';
import { useEffect } from 'react';
import Swal from 'sweetalert2';
// import { FiCheckCircle } from 'react-icons/fi';
import ForgotPasswordForm from './auth/ForgotPasswordForm';
import ResetPasswordForm from './auth/ResetPasswordForm';
import AdminInvoicedAppointments from './pages/admin/InvoicedAppointments';

// import OtpForm from './auth/OtpForm';
// import Signup from './pages/Signup';


function LoginRedirectHandler() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === '/login') {
      // Show success message only when coming from login page
      Swal.fire({
        title: 'Login Successful!',
        html: `
          <div class="text-center">
            <div class="text-green-400 text-6xl mb-4">
              <FiCheckCircle class="inline-block" />
            </div>
            <p class="text-gray-200 mb-2">Welcome back!</p>
            <p class="text-gray-300">You're now being redirected to the home page.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#6366f1',
        background: '#1e1b4b',
        color: '#ffffff',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          popup: 'border-2 border-indigo-500 rounded-xl',
          icon: 'hidden'
        }
      }).then(() => {
        navigate('/'); // Redirect to home page
      });
    }
  }, [user, navigate, location.pathname]);

  return null;
}

function PrivateRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();

  if (!user) {
    // Not logged in at all
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    // Logged in but not admin, trying to access admin route
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <LoginRedirectHandler />
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <ChatBot /> */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
           <Route path="/reset-password" element={<ResetPasswordForm />} />
           {/* <Route path="/send-otp/:email/:phone" element={<OtpForm/>} /> */}
           
          

          {/* User Protected Route */}
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <Navbar />
                <main className="flex-grow">
                  <Bookings />
                </main>
                <Footer />
              </PrivateRoute>
            }
          />

          <Route
            path="/book-now"
            element={
              <PrivateRoute>
                <Navbar />
                <main className="flex-grow">
                  <AddBooking />
                </main>
                <Footer />
              </PrivateRoute>
            }
          />


          {/* Admin Protected Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute adminOnly>
                <AdminNavbar />
                <main className="flex-grow">
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="appointments" element={<AdminAppointments />} />
                    <Route path="staff" element={<AdminStaff />} />
                    <Route path="services" element={<AdminServicesPage />} />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path='invoice' element={<AdminInvoicedAppointments />} />
           
                  </Routes>
                </main>
              </PrivateRoute>
            }
          />

          {/* Main Public Layout */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="services" element={<Services />} />
                    <Route path="stylists" element={<Stylists />} />
                    <Route path="portfolio" element={<Portfolio />} />
                    {/* <Route path="book-now" element={<AddBooking />} /> */}
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;