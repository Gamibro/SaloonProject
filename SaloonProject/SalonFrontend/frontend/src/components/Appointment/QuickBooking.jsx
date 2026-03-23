import axios from "axios";
// import { useState, useEffect } from 'react';
// import { FiCalendar, FiClock, FiScissors, FiX, FiCheck, FiAlertCircle, FiInfo, FiUser } from 'react-icons/fi';

// const API_BASE_URL = 'https://saloonbackend.dockyardsoftware.com/api/Appointment';
// const STAFF_API_URL = 'https://saloonbackend.dockyardsoftware.com/api/AdminAuth/staffview';

// const QuickBooking = ({ onBook }) => {
//   const [formData, setFormData] = useState({
//     service: '',
//     serviceId: null,
//     stylist: '',
//     stylistId: null,
//     date: '',
//     time: '',
//   });

//   const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
//   const [isStylistPickerOpen, setIsStylistPickerOpen] = useState(false);
//   const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [isLoadingSlots, setIsLoadingSlots] = useState(false);
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showSuccessPopup, setShowSuccessPopup] = useState(false);
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const [stylists, setStylists] = useState([]);

//   // Service mapping
//   const services = [
//     { name: 'Haircut', duration: '30 mins', id: 1 },
//     { name: 'Coloring', duration: '2 hours', id: 2 },
//     { name: 'Styling', duration: '45 mins', id: 3 },
//     { name: 'Manicure', duration: '1 hour', id: 4 },
//     { name: 'Pedicure', duration: '1 hour', id: 5 },
//     { name: 'Full Set', duration: '2.5 hours', id: 6 },
//     { name: 'Highlights', duration: '3 hours', id: 7 },
//     { name: 'Facial', duration: '1 hour', id: 8 }
//   ];

//   // Fetch stylists on component mount
//   useEffect(() => {
//     const fetchStylists = async () => {
//       try {
//         const res = await fetch(STAFF_API_URL);
//         const data = await res.json();
//         const staffList = Array.isArray(data.staff) ? data.staff.map(s => ({ id: s.Id, name: s.Name, role: s.Role })) : [];
//         setStylists(staffList);
//       } catch (err) {
//         console.error('Failed to fetch stylists:', err);
//       }
//     };
//     fetchStylists();
//   }, []);

//   // Helper functions
//   const getDurationInMinutes = (duration) => {
//     if (!duration) return 0;
//     const [value, unit] = duration.split(' ');
//     if (unit.includes('hour')) return parseInt(value) * 60;
//     return parseInt(value);
//   };

//   const formatTimeForDisplay = (time24) => {
//     const [hours, minutes] = time24.split(':');
//     const hour = parseInt(hours);
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const hour12 = hour % 12 || 12;
//     return `${hour12}:${minutes} ${ampm}`;
//   };

//   const convertTo24Hour = (time12h) => {
//     const [time, modifier] = time12h.split(' ');
//     let [hours, minutes] = time.split(':');

//     if (hours === '12') hours = '00';
//     if (modifier === 'PM') hours = parseInt(hours) + 12;

//     return `${hours}:${minutes}:00`;
//   };

//   const formatDisplayDate = (dateString) => {
//     const options = { weekday: 'short', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   // Fetch available slots when date or service changes
//   useEffect(() => {
//     if (formData.date && formData.serviceId) {
//       calculateAvailableSlots();
//     }
//   }, [formData.date, formData.serviceId]);

//   const calculateAvailableSlots = async () => {
//     setIsLoadingSlots(true);
//     setFormData(prev => ({ ...prev, time: '' }));
//     setError(null);

//     try {
//       const service = services.find(s => s.id === formData.serviceId);
//       const duration = getDurationInMinutes(service.duration);

//       const response = await fetch(`${API_BASE_URL}/availability?date=${encodeURIComponent(formData.date)}&duration=${duration}`);

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to fetch available slots: ${errorText}`);
//       }

//       const data = await response.json();
//       const slots = Array.isArray(data) ? data : data.$values;

//       if (!slots || !Array.isArray(slots)) {
//         throw new Error(`Expected an array of slots but got: ${JSON.stringify(data)}`);
//       }

//       // Filter out past times if selected date is today
//       const today = new Date().toISOString().split('T')[0];
//       const now = new Date();

//       const filteredSlots = slots.filter(slot => {
//         if (formData.date !== today) return true;
//         const [slotHours, slotMinutes] = slot.split(':').map(Number);
//         const slotDateTime = new Date();
//         slotDateTime.setHours(slotHours, slotMinutes, 0, 0);
//         return slotDateTime > now;
//       });

//       setAvailableSlots(filteredSlots.map(slot => formatTimeForDisplay(slot)));
//     } catch (err) {
//       console.error('Error fetching slots:', err);
//       setError('Failed to load available time slots. Please try again.');
//       setAvailableSlots([]);
//     } finally {
//       setIsLoadingSlots(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!formData.service || !formData.date || !formData.time || !formData.stylistId) {
//       setError('Please fill all fields');
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         throw new Error('Authentication required. Please log in.');
//       }

//       const response = await fetch(`${API_BASE_URL}/book`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify({
//           AppointmentDate: formData.date,
//           AppointmentTime: convertTo24Hour(formData.time),
//           ServiceTypeIds: [formData.serviceId],
//           StaffId: formData.stylistId
//         })
//       });

//       if (response.status === 401) {
//         throw new Error('Authentication required. Please log in.');
//       }

//       if (!response.ok) {
//         const error = await response.text();
//         throw new Error(error || 'Failed to book appointment');
//       }

//       const result = await response.json();

//       // Set booking details for success popup
//       const service = services.find(s => s.id === formData.serviceId);
//       const stylist = stylists.find(s => s.id === formData.stylistId);
//       setBookingDetails({
//         service: formData.service,
//         stylist: stylist?.name || 'Unknown stylist',
//         date: formData.date,
//         time: formData.time,
//         duration: service.duration
//       });

//       // Clear form
//       setFormData({
//         service: '',
//         serviceId: null,
//         stylist: '',
//         stylistId: null,
//         date: '',
//         time: '',
//       });

//       // Show success popup
//       setShowSuccessPopup(true);

//       // Notify parent component
//       if (onBook) {
//         onBook(result);
//       }

//     } catch (err) {
//       console.error('Booking failed:', err);
//       setError(err.message || 'Failed to book appointment. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleServiceSelect = (service) => {
//     setFormData({
//       ...formData,
//       service: service.name,
//       serviceId: service.id,
//       time: '' // Reset time when service changes
//     });
//     setIsServicePickerOpen(false);
//   };

//   const handleStylistSelect = (stylist) => {
//     setFormData({
//       ...formData,
//       stylist: stylist.name,
//       stylistId: stylist.id
//     });
//     setIsStylistPickerOpen(false);
//   };

//   const closeSuccessPopup = () => {
//     setShowSuccessPopup(false);
//     setBookingDetails(null);
//   };

//   return (
//     <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700 p-6 relative">
//       <h3 className="text-xl font-semibold mb-4">Quick Booking</h3>

//       {error && (
//         <div className="mb-4 p-3 bg-red-600 text-white rounded-lg flex items-center">
//           <FiAlertCircle className="mr-2" />
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Service Picker Trigger */}
//         <div
//           className="flex items-center bg-gray-700 rounded-lg p-3 cursor-pointer"
//           onClick={() => setIsServicePickerOpen(true)}
//         >
//           <FiScissors className="text-purple-400 mr-3" />
//           <div className="bg-gray-700 text-gray-100 w-full focus:outline-none cursor-pointer text-center">
//             {formData.service || "Select Service"}
//           </div>
//         </div>

//         {/* Stylist Picker Trigger */}
//         <div
//           className="flex items-center bg-gray-700 rounded-lg p-3 cursor-pointer"
//           onClick={() => setIsStylistPickerOpen(true)}
//         >
//           <FiUser className="text-purple-400 mr-3" />
//           <div className="bg-gray-700 text-gray-100 w-full focus:outline-none cursor-pointer text-center">
//             {formData.stylist || "Select Stylist"}
//           </div>
//         </div>

//         {/* Date Picker */}
//         <div className="flex items-center bg-gray-700 rounded-lg p-3">
//           <FiCalendar className="text-purple-400 mr-6" />
//           <input
//             type="date"
//             value={formData.date}
//             onChange={(e) => setFormData({...formData, date: e.target.value, time: ''})}
//             className="bg-gray-700 text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 text-center"
//             required
//             min={new Date().toISOString().split('T')[0]} // Disable past dates
//           />
//         </div>

//         {/* Time Slot Trigger */}
//         <div
//           className={`flex items-center bg-gray-700 rounded-lg p-3 ${
//             formData.date && formData.serviceId ? 'cursor-pointer' : 'opacity-50'
//           }`}
//           onClick={() => formData.date && formData.serviceId && setIsTimePickerOpen(true)}
//         >
//           <FiClock className="text-purple-400 mr-3" />
//           <div className="bg-gray-700 text-gray-100 w-full focus:outline-none text-center">
//             {formData.time || (
//               formData.date && formData.serviceId ? "Select Time" : "Select date and service first"
//             )}
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting || !formData.service || !formData.date || !formData.time || !formData.stylistId}
//           className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition ${
//             isSubmitting || !formData.service || !formData.date || !formData.time || !formData.stylistId ? 'opacity-70 cursor-not-allowed' : ''
//           }`}
//         >
//           {isSubmitting ? 'Booking...' : 'Book Now'}
//         </button>
//       </form>

//       {/* Service Popup */}
//       {isServicePickerOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Select Service</h3>
//               <button
//                 onClick={() => setIsServicePickerOpen(false)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <FiX className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
//               {services.map((service) => (
//                 <button
//                   key={service.id}
//                   type="button"
//                   onClick={() => handleServiceSelect(service)}
//                   className={`py-3 px-4 rounded-lg transition-all flex justify-center items-center ${
//                     formData.serviceId === service.id
//                       ? "bg-purple-600 text-white border border-purple-400"
//                       : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
//                   }`}
//                 >
//                   <span className="text-center">{service.name}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stylist Popup */}
//       {isStylistPickerOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Select Stylist</h3>
//               <button
//                 onClick={() => setIsStylistPickerOpen(false)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <FiX className="h-5 w-5" />
//               </button>
//             </div>

//             <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
//               {stylists.length === 0 ? (
//                 <div className="text-center py-8 text-gray-400">No stylists available</div>
//               ) : (
//                 stylists.map((stylist) => (
//                   <button
//                     key={stylist.id}
//                     type="button"
//                     onClick={() => handleStylistSelect(stylist)}
//                     className={`py-3 px-4 rounded-lg transition-all text-left ${
//                       formData.stylistId === stylist.id
//                         ? "bg-purple-600 text-white border border-purple-400"
//                         : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
//                     }`}
//                   >
//                     <div className="font-medium">{stylist.name}</div>
//                     {stylist.role && (
//                       <div className="text-sm text-gray-300 mt-1">{stylist.role}</div>
//                     )}
//                   </button>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Time Slot Popup */}
//       {isTimePickerOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">
//                 Available Time Slots
//                 {isLoadingSlots && <span className="text-sm text-gray-400 ml-2">Loading...</span>}
//               </h3>
//               <button
//                 onClick={() => setIsTimePickerOpen(false)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <FiX className="h-5 w-5" />
//               </button>
//             </div>

//             {availableSlots.length === 0 && !isLoadingSlots ? (
//               <div className="text-center py-8 text-gray-400">
//                 No available slots for this date and service.
//               </div>
//             ) : (
//               <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
//                 {availableSlots.map((slot) => (
//                   <button
//                     key={slot}
//                     type="button"
//                     onClick={() => {
//                       setFormData({...formData, time: slot});
//                       setIsTimePickerOpen(false);
//                     }}
//                     className={`py-3 px-2 rounded-lg transition-all flex justify-center items-center ${
//                       formData.time === slot
//                         ? "bg-purple-600 text-white border border-purple-400"
//                         : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
//                     }`}
//                   >
//                     <span className="text-center">{slot}</span>
//                     {formData.time === slot && <FiCheck className="ml-1" />}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Success Popup */}
//       {showSuccessPopup && bookingDetails && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//           <div className="bg-gray-800 rounded-xl border border-purple-500 shadow-2xl p-6 w-full max-w-md relative">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <FiCheck className="text-white text-2xl" />
//               </div>
//               <h3 className="text-2xl font-bold text-white mb-2">Appointment Booked!</h3>
//               <p className="text-gray-300">Your appointment has been confirmed</p>
//             </div>

//             <div className="bg-gray-700 rounded-lg p-4 mb-6">
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Service:</span>
//                   <span className="font-medium">{bookingDetails.service}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">With:</span>
//                   <span className="font-medium">{bookingDetails.stylist}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Date:</span>
//                   <span className="font-medium">
//                     {formatDisplayDate(bookingDetails.date)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Time:</span>
//                   <span className="font-medium">{bookingDetails.time}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Duration:</span>
//                   <span className="font-medium">{bookingDetails.duration}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-750 rounded-lg p-3 mb-6 flex items-start">
//               <FiInfo className="text-purple-400 mt-1 mr-3 flex-shrink-0" />
//               <div>
//                 <h4 className="font-medium mb-1">Reminder</h4>
//                 <p className="text-sm text-gray-400">
//                   Please arrive 10 minutes before your appointment time.
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={closeSuccessPopup}
//               className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition"
//             >
//               Done
//             </button>

//             <button
//               onClick={closeSuccessPopup}
//               className="absolute top-4 right-4 text-gray-400 hover:text-white"
//             >
//               <FiX className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuickBooking;

import { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiScissors,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiInfo
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
// https://nvsalonbackend.dockyardsoftware.com/api/Appointment
// https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth

// https://localhost:7014/api/Appointment
// https://localhost:7014/api/AdminAuth

const API_BASE_URL = "https://nvsalonbackend.dockyardsoftware.com/api/Appointment";
// const STAFF_API_URL = 'https://localhost:7014/api/AdminAuth/staffview';
const SERVICE_BASE_URL = "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth";

const QuickBooking = ({ onBook, onDone = ()=>{} }) => {
  const [formData, setFormData] = useState({
    service: "",
    serviceId: null,
    duration: "",
    stylist: "",
    stylistId: null,
    date: "",
    time: "",
  });
  const [services, setServices] = useState([]);
  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
  // const [isStylistPickerOpen, setIsStylistPickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const navigate = useNavigate();
  // const [stylists, setStylists] = useState([]);

  // const services = [
  //   { name: 'Haircut', duration: '30 mins', id: 1 },
  //   { name: 'Coloring', duration: '2 hours', id: 2 },
  //   { name: 'Styling', duration: '45 mins', id: 3 },
  //   { name: 'Manicure', duration: '1 hour', id: 4 },
  //   { name: 'Pedicure', duration: '1 hour', id: 5 },
  //   { name: 'Facial', duration: '2.5 hours', id: 6 },
  //   { name: 'Waxing', duration: '3 hours', id: 7 },
  //   { name: 'Makeup', duration: '1 hour', id: 8 }
  // ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${SERVICE_BASE_URL}/active-services`);
        setServices(res.data);
        console.log(services);
      } catch (error) {
        console.error("Error fetching services ", error);
      }
    };

    fetchServices();
  }, []);

//   const handleDone = () => {
//   setShowSuccessPopup(false);
//   setBookingDetails(null);
//   navigate("/bookings");
// };

  // useEffect(() => {
  //   const fetchStylists = async () => {
  //     try {
  //       const res = await fetch(STAFF_API_URL);
  //       const data = await res.json();
  //       const staffList = Array.isArray(data.staff) ? data.staff.map(s => ({ id: s.Id, name: s.Name, role: s.Role })) : [];
  //       setStylists(staffList);
  //     } catch (err) {
  //       console.error('Failed to fetch stylists:', err);
  //     }
  //   };
  //   fetchStylists();
  // }, []);

  // const getDurationInMinutes = (duration) => {
  //   if (!duration) return 0;
  //   const [value, unit] = duration.split(' ');
  //   if (unit.includes('hour')) return parseFloat(value) * 60;
  //   return parseInt(value);
  // };

  const getDurationInMinutes = (duration) => {
    if (!duration) return 0;
    const [value, unit] = duration.split(" ");
    if (unit.includes("hour")) return parseFloat(value) * 60;
    return parseInt(value);
  };


  const formatTimeForDisplay = (time24) => {
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };


  const formatDurationDisplay = (durationStr) => {
  if (!durationStr) return "";
  const mins = getDurationInMinutes(durationStr); // uses your existing helper
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} ${h > 1 ? "hrs" : "hr"} ${m} min`;
  if (h) return `${h} ${h > 1 ? "hrs" : "hr"}`;
  return `${m} min`;
};
  

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = parseInt(hours) + 12;
    return `${hours}:${minutes}:00`;
  };

  const formatDisplayDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const getAvailableSlots = async (date, duration) => {
    const response = await fetch(
      `${API_BASE_URL}/availability?date=${encodeURIComponent(
        date
      )}&duration=${duration}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok)
      throw new Error(
        `Failed to fetch available slots: ${await response.text()}`
      );
    const data = await response.json();
    const slots = Array.isArray(data) ? data : data.$values;
    const today = new Date().toISOString().split("T")[0];
    const now = new Date();
    return slots
      .filter((slot) => {
        if (date !== today) return true;
        const [slotHours, slotMinutes] = slot.split(":").map(Number);
        const slotDateTime = new Date();
        slotDateTime.setHours(slotHours, slotMinutes, 0, 0);
        return slotDateTime > now;
      })
      .map((slot) => formatTimeForDisplay(slot));
  };

  const calculateAvailableSlots = async () => {
    setIsLoadingSlots(true);
    setFormData((prev) => ({ ...prev, time: "" }));
    setError(null);
    const duration = getDurationInMinutes(formData.duration);
    // const staffId = formData.stylistId;
    if (!duration || !formData.date) {
      setAvailableSlots([]);
      setIsLoadingSlots(false);
      return;
    }
    try {
      const slots = await getAvailableSlots(formData.date, duration);
      setAvailableSlots(slots);
    } catch (error) {
      setError("Failed to load available time slots. Please try again.");
      setAvailableSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (formData.date && formData.duration) calculateAvailableSlots();
  }, [formData.date, formData.duration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.service || !formData.date || !formData.time) {
      setError("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        throw new Error("Authentication required. Please log in.")
        
      };

      const response = await fetch(`${API_BASE_URL}/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // credentials: 'include',
        body: JSON.stringify({
          AppointmentDate: formData.date,
          AppointmentTime: convertTo24Hour(formData.time),
          ServiceTypeIds: [formData.serviceId],
          // StaffId: formData.stylistId
        }),
      });

      if (response.status === 401){
        navigate("/login");
         throw new Error("Authentication required. Please log in.");
        

      }
       
        
      if (!response.ok)
        throw new Error(
          (await response.text()) || "Failed to book appointment"
        );

      const result = await response.json();
      const appointmentId = result?.appointmentId;
      const totalPrice = result?.totalPrice;
      // const stylist = stylists.find(s => s.id === formData.stylistId);
      setBookingDetails({
        service: formData.service,
        // stylist: stylist?.name || 'Unknown stylist',
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        appointmentId,
        totalPrice
      });

      setFormData({
        service: "",
        serviceId: null,
        duration: "",
        // stylist: '',
        // stylistId: null,
        date: "",
        time: "",
      });

      setShowSuccessPopup(true);
      if (onBook) onBook(result);
    } catch (err) {
      console.error("Booking failed:", err);
      setError(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceSelect = (service) => {
  setFormData({
    ...formData,
    service: service.Name,
    serviceId: service.Id,
    servicePrice: service.Price,
    duration: "60 mins",
    time:""                 
  });
  setIsServicePickerOpen(false);
};
  // const handleStylistSelect = (stylist) => {
  //   setFormData({
  //     ...formData,
  //     stylist: stylist.name,
  //     stylistId: stylist.id
  //   });
  //   setIsStylistPickerOpen(false);
  // };

  const closeSuccessPopup = () => {
    setShowSuccessPopup(false);
    setBookingDetails(null);
    // onDone();
  };

  const formatPrice = (price) => {
  if (price == null || isNaN(price)) return "LKR 0.00";
  return `LKR ${Number(price).toFixed(2)}`;
};

  // ...rest of your JSX remains unchanged
  // Your complete JSX is already written in your original post and can be appended below

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700 p-6 relative">
      <h3 className="text-xl font-semibold mb-4">Quick Booking</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-lg flex items-center">
          <FiAlertCircle className="mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Picker Trigger */}
        <div
          className="flex items-center bg-gray-700 rounded-lg p-3 cursor-pointer"
          onClick={() => setIsServicePickerOpen(true)}
        >
          <FiScissors className="text-purple-400 mr-3" />
          <div className="bg-gray-700 text-gray-100 w-full focus:outline-none cursor-pointer text-center">
           { formData.service || "Select Service"}
          </div>
        </div>

        {/* Stylist Picker Trigger */}
        {/* <div 
          className="flex items-center bg-gray-700 rounded-lg p-3 cursor-pointer"
          onClick={() => setIsStylistPickerOpen(true)}
        >
          <FiUser className="text-purple-400 mr-3" />
          <div className="bg-gray-700 text-gray-100 w-full focus:outline-none cursor-pointer text-center">
            {formData.stylist || "Select Stylist"}
          </div>
        </div> */}

        {/* Date Picker */}
        <div className="flex items-center bg-gray-700 rounded-lg p-3">
          <FiCalendar className="text-purple-400 mr-6" />
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value, time: "" })
            }
            className="bg-gray-700 text-gray-100 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 text-center"
            required
            min={new Date().toISOString().split("T")[0]} // Disable past dates
          />
        </div>

        {/* Time Slot Trigger */}
        <div
          className={`flex items-center bg-gray-700 rounded-lg p-3 ${
            formData.date && formData.serviceId
              ? "cursor-pointer"
              : "opacity-50"
          }`}
          onClick={() =>
            formData.date && formData.serviceId && setIsTimePickerOpen(true)
          }
        >
          <FiClock className="text-purple-400 mr-3" />
          <div className="bg-gray-700 text-gray-100 w-full focus:outline-none text-center">
            {formData.time ||
              (formData.date && formData.serviceId
                ? "Select Time"
                : "Select date and service first")}
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.service ||
            !formData.date ||
            !formData.time
          }
          className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition ${
            isSubmitting ||
            !formData.service ||
            !formData.date ||
            !formData.time
              ? "opacity-70 cursor-not-allowed"
              : ""
          }`}
        >
          {isSubmitting ? "Booking..." : "Book Now"}
        </button>
      </form>

      {/* Service Popup */}
      {isServicePickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Service</h3>
              <button
                onClick={() => setIsServicePickerOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleServiceSelect(service)}
                  className={`py-3 px-4 rounded-lg transition-all flex justify-center items-center ${
                    formData.serviceId === service.id
                      ? "bg-purple-600 text-white border border-purple-400"
                      : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                  }`}
                >
                  <span className="text-center">{service.name}</span>
                </button>
              ))}
            </div> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {services.map((service) => (
                <button
                  key={service.Id}
                  type="button"
                  onClick={() => handleServiceSelect(service)}
                  className={`group relative w-full rounded-2xl border p-4 text-left transition
        ${
          formData.serviceId === service.Id
            ? "border-purple-500 bg-purple-600/10 shadow-lg shadow-purple-900/30"
            : "border-gray-700 bg-gray-750 hover:border-gray-600 hover:bg-gray-700/80"
        }
      `}
                >
                  {/* Top row: name + price pill */}
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-semibold tracking-wide text-gray-100">
                      {service.Name}
                    </span>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide
            ${
              formData.serviceId === service.Id
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-200"
            }
          `}
                    >
                      LKR {service.Price}
                    </span>
                  </div>

                  {/* Subtle divider */}
                  <div className="mt-3 h-px w-full bg-gray-700/70" />

                  {/* Footer row: hint + selected check */}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider text-gray-400">
                      Tap to select
                    </span>

                    {formData.serviceId === service.Id && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-600/20 px-2 py-1 text-[11px] font-medium text-purple-300">
                        <FiCheck className="h-3.5 w-3.5" />
                        Selected
                      </span>
                    )}
                  </div>

                  {/* Focus ring */}
                  <span
                    className={`pointer-events-none absolute inset-0 rounded-2xl ring-1 transition
          ${
            formData.serviceId === service.Id
              ? "ring-purple-500/50"
              : "ring-transparent group-hover:ring-gray-600/50"
          }
        `}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stylist Popup
      {isStylistPickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Stylist</h3>
              <button 
                onClick={() => setIsStylistPickerOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {stylists.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No stylists available</div>
              ) : (
                stylists.map((stylist) => (
                  <button
                    key={stylist.id}
                    type="button"
                    onClick={() => handleStylistSelect(stylist)}
                    className={`py-3 px-4 rounded-lg transition-all text-left ${
                      formData.stylistId === stylist.id
                        ? "bg-purple-600 text-white border border-purple-400"
                        : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                    }`}
                  >
                    <div className="font-medium">{stylist.name}</div>
                    {stylist.role && (
                      <div className="text-sm text-gray-300 mt-1">{stylist.role}</div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )} */}

      {/* Time Slot Popup */}
      {isTimePickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Available Time Slots
                {isLoadingSlots && (
                  <span className="text-sm text-gray-400 ml-2">Loading...</span>
                )}
              </h3>
              <button
                onClick={() => setIsTimePickerOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {availableSlots.length === 0 && !isLoadingSlots ? (
              <div className="text-center py-8 text-gray-400">
                No available slots for this date and service.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, time: slot });
                      setIsTimePickerOpen(false);
                    }}
                    className={`py-3 px-2 rounded-lg transition-all flex justify-center items-center ${
                      formData.time === slot
                        ? "bg-purple-600 text-white border border-purple-400"
                        : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                    }`}
                  >
                    <span className="text-center">{slot}</span>
                    {formData.time === slot && <FiCheck className="ml-1" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && bookingDetails && (
        // <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
        <div className="fixed top-12 inset-0 bg-black bg-opacity-70 grid place-items-center jusitify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl border border-purple-500 shadow-2xl p-6 w-full max-w-md relative">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white ">
                Appointment Booked!
              </h3>
              {bookingDetails.appointmentId ?(
              <p className="text-gray-300">Your Appointment ID: {bookingDetails.appointmentId} has been confirmed</p>
              ):(
                <p className="text-gray-300">
                Your appointment has been confirmed
              </p>

              )}
              
            </div>

            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Service:</span>
                  <span className="font-medium">{bookingDetails.service}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Date:</span>
                  <span className="font-medium">
                    {formatDisplayDate(bookingDetails.date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="font-medium">{bookingDetails.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span className="font-medium">{formatDurationDisplay(bookingDetails.duration)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="font-medium">{formatPrice(bookingDetails.totalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-750 rounded-lg p-3  flex items-start">
              <FiInfo className="text-purple-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">Reminder</h4>
                <p className="text-sm text-gray-400">
                  Please arrive 10 minutes before your appointment time.
                </p>
              </div>
            </div>

            <button
              onClick={()=>{
                closeSuccessPopup();
                onDone();
              }
                
              }
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition"
            >
              Done
            </button>

            {/* <button
              onClick={closeSuccessPopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FiX className="h-5 w-5" />
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickBooking;
