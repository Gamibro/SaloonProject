// import { useState, useEffect ,useCallback} from 'react';
// import { FiCalendar, FiClock, FiUser, FiScissors } from 'react-icons/fi';
// import Modal from '../UI/Modal';

// const AddAppointment = ({ onClose, onAddAppointment, appointmentToEdit }) => {
//   const [formData, setFormData] = useState({
//     service: appointmentToEdit?.service || '',
//     stylist: appointmentToEdit?.stylist || '',
//     date: appointmentToEdit?.date || '',
//     time: appointmentToEdit?.time || '',
//     notes: appointmentToEdit?.notes || ''
//   });

//   const services = ['Haircut', 'Coloring', 'Styling', 'Manicure', 'Pedicure', 'Facial'];
//   const stylists = ['Emma Johnson', 'Michael Smith', 'Sophia Williams', 'James Brown'];
//   const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

//   const [filteredTimeSlots, setFilteredTimeSlots] = useState(timeSlots);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     // If date changed, update filtered time slots
//     if (name === 'date') {
//       filterTimeSlots(value);
//       // Reset time if current time slot no longer valid
//       setFormData(prev => ({ ...prev, time: '' }));
//     }
//   };

//   // Filter time slots based on selected date and current time
//   const filterTimeSlots = (selectedDate) => {
//     if (!selectedDate) {
//       setFilteredTimeSlots(timeSlots);
//       return;
//     }

//     const now = new Date();
//     const todayStr = now.toISOString().split('T')[0]; // yyyy-mm-dd

//     if (selectedDate === todayStr) {
//       // Only allow time slots after current hour
//       const currentHour = now.getHours();

//       // Convert time slot like "9:00 AM" to 24-hour integer for comparison
//       const filtered = timeSlots.filter(slot => {
//         const [time, modifier] = slot.split(' '); // e.g. ["9:00", "AM"]
//         let [hour, minute] = time.split(':').map(Number);
//         if (modifier === 'PM' && hour !== 12) hour += 12;
//         if (modifier === 'AM' && hour === 12) hour = 0;

//         return hour > currentHour; // only future hours allowed
//       });

//       setFilteredTimeSlots(filtered);
//     } else {
//       // If not today, all time slots available
//       setFilteredTimeSlots(timeSlots);
//     }
//   };

//   // Run filtering initially if editing and date exists
//   useEffect(() => {
//     if (formData.date) {
//       filterTimeSlots(formData.date);
//     }
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onAddAppointment(formData);
//     onClose();
//   };

//   return (
//     <Modal onClose={onClose} title={appointmentToEdit ? "Edit Appointment" : "Book New Appointment"}>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="flex items-center bg-gray-700 rounded-lg p-3">
//           <FiScissors className="text-purple-400 mr-3" />
//           <select
//             name="service"
//             value={formData.service}
//             onChange={handleChange}
//             className="bg-transparent w-full focus:outline-none"
//             required
//           >
//             <option value="">Select Service</option>
//             {services.map(service => (
//               <option key={service} value={service}>{service}</option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center bg-gray-700 rounded-lg p-3">
//           <FiUser className="text-purple-400 mr-3" />
//           <select
//             name="stylist"
//             value={formData.stylist}
//             onChange={handleChange}
//             className="bg-transparent w-full focus:outline-none"
//             required
//           >
//             <option value="">Select Stylist</option>
//             {stylists.map(stylist => (
//               <option key={stylist} value={stylist}>{stylist}</option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center bg-gray-700 rounded-lg p-3">
//           <FiCalendar className="text-purple-400 mr-3" />
//           <input
//             type="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             className="bg-transparent w-full focus:outline-none"
//             required
//             min={new Date().toISOString().split('T')[0]} // can't book past dates
//           />
//         </div>

//         <div className="flex items-center bg-gray-700 rounded-lg p-3">
//           <FiClock className="text-purple-400 mr-3" />
//           <select
//             name="time"
//             value={formData.time}
//             onChange={handleChange}
//             className="bg-transparent w-full focus:outline-none"
//             required
//             disabled={!formData.date} // disable until date selected
//           >
//             <option value="">Select Time</option>
//             {filteredTimeSlots.length === 0 && <option disabled>No available slots</option>}
//             {filteredTimeSlots.map(time => (
//               <option key={time} value={time}>{time}</option>
//             ))}
//           </select>
//         </div>

//         <div className="bg-gray-700 rounded-lg p-3">
//           <textarea
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             placeholder="Additional notes (optional)"
//             className="bg-transparent w-full focus:outline-none resize-none h-20"
//           />
//         </div>

//         <div className="flex justify-end space-x-3 pt-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
//             disabled={!formData.time} // disable until time selected
//           >
//             {appointmentToEdit ? "Update Booking" : "Confirm Booking"}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default AddAppointment;
import { useState, useEffect } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
// import AdminAppointmentList from '../../components/Appointment/AdminAppointmentList';
import StaffAssignment from '../../components/Stylist/StaffAssignment';

const API_BASE_URL = 'https://nvsalonbackend.dockyardsoftware.com/api';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [staffList, setStaffList] = useState([]);

  // Helper to get staff name by Id from local staffList state
  const getStaffNameById = (id) => {
    const staff = staffList.find((s) => s.Id === id);
    return staff ? staff.Name : 'Unassigned';
  };

  useEffect(() => {
    const fetchStaff = async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      const response = await fetch(`${API_BASE_URL}/AdminAuth/staffview`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch staff');

      const data = await response.json();
      const staffs = data.staff || [];
      setStaffList(staffs);
      return staffs;
    };

 const fetchAppointments = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication token missing');

  const response = await fetch(`${API_BASE_URL}/Appointment/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error(`Failed to fetch appointments: ${response.statusText}`);

  const data = await response.json();

  const mappedAppointments = data.map(appt => ({
    id: appt.Id,
    client: appt.User?.Name || appt.UserName || 'N/A',
    service: appt.ServiceName || 'N/A',
  
    date: appt.AppointmentDate ? new Date(appt.AppointmentDate).toISOString().split('T')[0] : 'N/A',
    time: appt.AppointmentTime || 'N/A',
    status: appt.Status ,
    staffId: appt.StaffId || null,
    assignedTo: appt.StaffId ? `Staff ID: ${appt.StaffId}` : 'Unassigned',
    userName: appt.User?.UserName || appt.UserName || '',
    price: appt.Price || 0,
  }));

  setAppointments(mappedAppointments);
};



    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const staffs = await fetchStaff();
        await fetchAppointments(staffs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  
  

  const filteredAppointments = appointments
    .filter(appt =>
      (filter === 'all' || appt.status.toLowerCase() === filter.toLowerCase()) &&
      (appt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.service.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleAssignStaff = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAssignmentModal(true);
  };

  // Delete appointment
  const handleDelete = async (appointmentId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/Appointment/${appointmentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Delete failed');

      setAppointments(prev => prev.filter(appt => appt.id !== appointmentId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete appointment');
    }
  };

  // Start editing date/time
  const startEditing = (appt) => {
    setEditingId(appt.id);
    setEditDate(appt.date !== 'N/A' ? appt.date : '');
    setEditTime(appt.time !== 'N/A' ? appt.time : '');
    setEditStatus(appt.status);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditDate('');
    setEditTime('');
    setEditStatus('');
  };

  // Save updated date/time
  // const saveDateTime = async () => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return;
  //   if (!editDate || !editTime) {
  //     alert('Date and Time cannot be empty');
  //     return;
  //   }

  //   try {
  //     const response = await fetch(`${API_BASE_URL}/Appointment/${editingId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         AppointmentDate: editDate,
  //         AppointmentTime: editTime,
  //       }),
  //     });

  //     if (!response.ok) throw new Error('Failed to update appointment date/time');

  //     setAppointments(prev =>
  //       prev.map(appt =>
  //         appt.id === editingId ? { ...appt, date: editDate, time: editTime } : appt
  //       )
  //     );
  //     cancelEditing();
  //   } catch (err) {
  //     console.error(err);
  //     alert('Failed to update appointment date/time');
  //   }
  // };
// Save updated date/time
const saveDateTime = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;
  if (!editDate || !editTime) {
    alert('Date and Time cannot be empty');
    return;
  }

  // Ensure time is in "HH:mm:ss" format
  const formattedTime = editTime.length === 5 ? `${editTime}:00` : editTime;

  try {
    const response = await fetch(`${API_BASE_URL}/Appointment/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        AppointmentDate: editDate,         // Just YYYY-MM-DD is okay
        AppointmentTime: formattedTime     // Must be HH:mm:ss
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update: ${errorText}`);
    }

    setAppointments(prev =>
      prev.map(appt =>
        appt.id === editingId ? { ...appt, date: editDate, time: formattedTime } : appt
      )
    );
    cancelEditing();
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


  // Update status
  const updateStatus = async (appointmentId, userName, newStatus) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/AdminAuth/update-appointment-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          AppointmentId: appointmentId,
          UserName: userName,
          Status: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setAppointments(prev =>
        prev.map(appt =>
          appt.id === appointmentId ? { ...appt, status: newStatus } : appt
        )
      );

      if (appointmentId === editingId) setEditStatus(newStatus);
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

const handleAssignmentComplete = async (appointmentId, staffId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token missing');

      const parsedStaffId = parseInt(staffId);

      const response = await fetch(`${API_BASE_URL}/AdminAuth/assign-staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          AppointmentId: appointmentId,
          StaffId: parsedStaffId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to assign staff: ${errorText}`);
      }

      alert('Staff assigned successfully'); //aaaahh

      // Update appointment in state with new staff assignment and staffId
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId
            ? {
                ...appt,
                staffId: parsedStaffId,
                assignedTo: getStaffNameById(parsedStaffId),
              }
            : appt
        )
      );

      setShowAssignmentModal(false); // Close modal after assignment
    } catch (error) {
      console.error('Error assigning staff:', error.message);
      alert('Error assigning staff: ' + error.message);
    }
  };




  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Manage Appointments</h2>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            {/* <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
            /> */}
          </div>


          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="flex items-center">
              <FiFilter className="text-gray-400 mr-2" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading appointments...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          // <table className="w-full table-auto border-collapse border border-gray-700">
          <table className="w-full table-fixed border-collapse border border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-800 text-left">
                {/* <th className="border border-gray-700 px-3 py-2">Client</th> */}
                <th className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">Client</th>
                <th className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">Service</th>
                <th className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">Date</th>
                <th className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">Time</th>
                <th className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">Status</th>
                <th className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">Price</th>
                <th className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">Assigned To</th>
                <th className="border border-gray-700 px-3 py-2 algin-middle whitespace-nowrap">Actions</th>
                

              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appt => (
                <tr key={appt.id} className="border border-gray-700 hover:bg-gray-800">
                  <td className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">{appt.client}</td>
                  <td className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">{appt.service}</td>
                  <td className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">
                    {editingId === appt.id ? (
                      <input
                        type="date"
                        value={editDate}
                        onChange={e => setEditDate(e.target.value)}
                        className="bg-gray-800 border border-gray-600 rounded px-2 h-9 text-gray-100 w-full"
                      />
                    ) : (
                      appt.date
                    )}
                  </td>
                  <td className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">
                    {editingId === appt.id ? (
                      <input
                        type="time"
                        value={editTime}
                        onChange={e => setEditTime(e.target.value)}
                        className="bg-gray-800 border border-gray-600 rounded px-2 h-9 text-gray-100 w-full"
                      />
                    ) : (
                      appt.time
                    )}
                  </td>
                  <td className="border border-gray-700 px-3 py-2 align-middle whitespace-nowrap">
                    {editingId === appt.id ? (
                      <select
                        value={editStatus}
                        onChange={e => {
                          setEditStatus(e.target.value);
                          updateStatus(appt.id, appt.userName, e.target.value);
                        }}
                        className="bg-gray-800 border border-gray-600 rounded px-2 h-9 text-gray-100 w-full"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Ongoing">Ongoing</option>
                      </select>
                    ) : (
                      appt.status
                    )}
                  </td>
                   <td>
                      {appt.price.toLocaleString('en-LK', {
                        style: 'currency',
                        currency: 'LKR',
                      })}
                    </td> {/* ✅ Nicely formatted */}
                    
                  <td className="border border-gray-700 px-3 py-2">{appt.assignedTo}</td>
                  <td className="border border-gray-700 px-3 py-2 space-x-2">
                    {editingId === appt.id ? (
                      <>
                        <button
                          onClick={saveDateTime}
                          className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(appt)}
                          className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAssignStaff(appt)}
                          className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
                        >
                          Assign Staff
                        </button>
                        <button
                          onClick={() => handleDelete(appt.id)}
                          className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showAssignmentModal && selectedAppointment && (
          <StaffAssignment
            appointment={selectedAppointment}
            onClose={() => setShowAssignmentModal(false)}
            onAssign={handleAssignmentComplete}
          />
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentsPage;
