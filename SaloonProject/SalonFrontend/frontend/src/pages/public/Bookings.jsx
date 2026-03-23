import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import AddAppointment from '../../components/Appointment/AddAppointment';
import AppointmentList from '../../components/Appointment/AppointmentList';
// https://localhost:7014/api/Appointment
const API_BASE_URL = 'https://nvsalonbackend.dockyardsoftware.com/api/Appointment';

const BookingsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
 //Fake service taken from the api. 
 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found');
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const extractedUserId =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      if (!extractedUserId) {
        console.error('User ID not found in token');
      }
      setUserId(Number(extractedUserId));
    } catch (err) {
      console.error('Failed to decode token:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch appointments');

        const data = await response.json();

        const mappedAppointments = data.map((appt) => ({
          id: Number(appt.Id),
          service: appt.ServiceName || 'No Service',
          stylist: appt.StaffName || 'No Stylist Assigned',
          date: appt.AppointmentDate
            ? new Date(appt.AppointmentDate).toLocaleDateString()
            : 'Date Missing',
          time: formatTime(appt.AppointmentTime),
          notes: appt.AppointmentNotes || 'Not Available',
          status: appt.Status?.trim() || 'No Status',
        })).sort((a, b) => b.id - a.id); // ⭐ Sort newest-first;

        setAppointments(mappedAppointments);
      } catch (error) {
        console.error('Error loading appointments:', error.message);
      }
    };

    fetchUserAppointments();
  }, [userId]);

  const handleAddAppointment = (newAppointment) => {
    if (editingAppointment) {
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === editingAppointment.id ? { ...newAppointment, id: appt.id } : appt
        )
      );
      setEditingAppointment(null);
    } else {
      setAppointments((prev) => [
        ...prev,
        { ...newAppointment, id: Date.now(), status: 'Confirmed' },
      ]);
    }
    setShowAddModal(false);
  };

  const handleDeleteAppointment = (id) => {
    setAppointments((prev) => prev.filter((appt) => appt.id !== id));
  };

  const handleEditAppointment = (appointment) => {
    // Option 1: Use the modal (existing behavior)
    setEditingAppointment(appointment);
    setShowAddModal(true);
    
    // Option 2: Redirect to /book-now page with state
    // navigate('/book-now', { state: { appointment } });
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!userId) return <p className="p-4 text-red-500">Please log in to view your appointments.</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <h2 className="text-2xl font-bold">My Appointments</h2>
          <div className="flex sm:gap-4">
            {/* <button
              onClick={() => {
                setEditingAppointment(null);
                setShowAddModal(true);
              }}
              className="flex items-center bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
            >
              <FiPlus className="mr-2" />
              New Appointment (Modal)
            </button> */}
            <Link
              to="/book-now"
              className="flex items-center bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
            >
              <FiPlus className="mr-2" />
              New Appointment 
            </Link>
          </div>
        </div>

        <AppointmentList
          appointments={appointments}
          onEdit={handleEditAppointment}
          onDelete={handleDeleteAppointment}
        />

        {showAddModal && (
          <AddAppointment
            onClose={() => setShowAddModal(false)}
            onAddAppointment={handleAddAppointment}
            appointmentToEdit={editingAppointment}
          />
        )}
      </div>
    </div>
  );
};

export default BookingsPage;