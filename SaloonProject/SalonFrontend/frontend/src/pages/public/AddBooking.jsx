// import { useState, useEffect } from 'react';
// import { FiCalendar, FiClock, FiScissors, FiUser, FiX, FiInfo, FiCheck, FiAlertCircle } from 'react-icons/fi';

// // API Service Functions
// const API_BASE_URL = 'https://saloonbackend.dockyardsoftware.com/api/Appointment';

// const bookAppointment = async (appointmentData, token) => {
//   if (!token) {
//     throw new Error('Authentication required. Please log in.');
//   }

//   console.log('Token sent for booking:', token); // Debug token presence

//   const response = await fetch(`${API_BASE_URL}/book`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//     body: JSON.stringify({
//       AppointmentDate: appointmentData.date,
//       AppointmentTime: appointmentData.time,
//       ServiceTypeIds: [appointmentData.serviceId]
//     })
//   });

//   if (response.status === 401) {
//     throw new Error('Authentication required. Please log in.');
//   }

//   if (!response.ok) {
//     const error = await response.text();
//     throw new Error(error || 'Failed to book appointment');
//   }

//   const result = await response.json();
//   return result;
// };

// const getAvailableSlots = async (date, duration) => {
//   try {
//     console.log("Requesting available slots for date:", date, "duration:", duration);

//     const response = await fetch(`${API_BASE_URL}/availability?date=${encodeURIComponent(date)}&duration=${duration}`);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Server Error:', errorText);
//       throw new Error(`Failed to fetch available slots: ${errorText}`);
//     }

//     const data = await response.json();
//     console.log('🟢 Raw backend response:', data);

//     const slots = Array.isArray(data) ? data : data.$values;

//     if (!slots || !Array.isArray(slots)) {
//       throw new Error(`Expected an array of slots but got: ${JSON.stringify(data)}`);
//     }

//     // Filter out past times if selected date is today
//     const today = new Date().toISOString().split('T')[0];
//     const now = new Date();

//     const filteredSlots = slots.filter(slot => {
//       if (date !== today) return true;

//       // Compare slot time with current time
//       const [slotHours, slotMinutes] = slot.split(':').map(Number);
//       const slotDateTime = new Date();
//       slotDateTime.setHours(slotHours, slotMinutes, 0, 0);

//       return slotDateTime > now;
//     });

//     return filteredSlots.map(slot => formatTimeForDisplay(slot));
//   } catch (err) {
//     console.error('getAvailableSlots Error:', err.message);
//     throw err;
//   }
// };

// // Helper function remains the same
// const formatTimeForDisplay = (time24) => {
//   const [hours, minutes] = time24.split(':');
//   const hour = parseInt(hours);
//   const ampm = hour >= 12 ? 'PM' : 'AM';
//   const hour12 = hour % 12 || 12;
//   return `${hour12}:${minutes} ${ampm}`;
// };

// // Helper function to convert duration string to minutes
// const getDurationInMinutes = (duration) => {
//   if (!duration) return 0;
//   const [value, unit] = duration.split(' ');
//   if (unit.includes('hour')) return parseInt(value) * 60;
//   return parseInt(value);
// };

// // Convert 12-hour time to 24-hour format
// const convertTo24Hour = (time12h) => {
//   const [time, modifier] = time12h.split(' ');
//   let [hours, minutes] = time.split(':');

//   if (hours === '12') hours = '00';
//   if (modifier === 'PM') hours = parseInt(hours) + 12;

//   return `${hours}:${minutes}:00`;
// };

// const AddBooking = () => {
//   const [formData, setFormData] = useState({
//     service: '',
//     serviceId: null,
//     stylist: '',
//     date: '',
//     time: '',
//     notes: '',
//     duration: '',
//     price: ''
//   });

//   const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
//   const [isStylistPickerOpen, setIsStylistPickerOpen] = useState(false);
//   const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [isLoadingSlots, setIsLoadingSlots] = useState(false);
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [bookingDetails, setBookingDetails] = useState(null);
//   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Service mapping to backend IDs
//   const serviceMap = {
//     'Haircut': 1,
//     'Coloring': 2,
//     'Styling': 3,
//     'Manicure': 4,
//     'Pedicure': 5,
//     'Full Set': 6,
//     'Highlights': 7,
//     'Facial': 8
//   };

//   const services = [
//     { name: 'Haircut', duration: '30 mins', price: 'Rs.3,500', id: 1 },
//     { name: 'Coloring', duration: '2 hours', price: 'Rs.1,200', id: 2 },
//     { name: 'Styling', duration: '45 mins', price: 'Rs.5,000', id: 3 },
//     { name: 'Manicure', duration: '1 hour', price: 'Rs.4,000', id: 4 },
//     { name: 'Pedicure', duration: '1 hour', price: 'Rs.4,500', id: 5 },
//     { name: 'Full Set', duration: '2.5 hours', price: 'Rs.15,500', id: 6 },
//     { name: 'Highlights', duration: '3 hours', price: 'Rs.10,800', id: 7 },
//     { name: 'Facial', duration: '1 hour', price: 'Rs.8,000', id: 8 }
//   ];

//   const stylists = [
//     { name: 'Rayan Pranandu', specialty: 'Coloring', rating: '4.9' },
//     { name: 'Michael Smith', specialty: 'Haircut', rating: '4.8' },
//     { name: 'Sahini Abecone', specialty: 'Styling', rating: '4.7' },
//     { name: 'David Frenando', specialty: 'Manicure', rating: '4.9' },
//     { name: 'Charith Silva', specialty: 'Facial', rating: '5.0' },
//     { name: 'Naduni Abecone', specialty: 'Styling', rating: '4.7' },
//     { name: 'Uvin Frenando', specialty: 'Manicure', rating: '4.9' },
//     { name: 'Anura Silva', specialty: 'Facial', rating: '5.0' }
//   ];

//   useEffect(() => {
//     if (formData.date && formData.duration) {
//       calculateAvailableSlots();
//     }
//   }, [formData.date, formData.duration]);

//   const calculateAvailableSlots = async () => {
//     setIsLoadingSlots(true);
//     setFormData(prev => ({ ...prev, time: '' }));
//     setError(null);

//     try {
//       const slots = await getAvailableSlots(formData.date, getDurationInMinutes(formData.duration));
//       setAvailableSlots(slots);
//     } catch (error) {
//       console.error('Error fetching slots:', error);
//       setError('Failed to load available time slots. Please try again.');
//       setAvailableSlots([]);
//     } finally {
//       setIsLoadingSlots(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     try {
//       // In a real app, you would get this from your auth context or localStorage
//       const token = localStorage.getItem('token');

//       if (!token) {
//         throw new Error('Authentication required. Please log in.');
//       }

//       const response = await bookAppointment({
//         date: formData.date,
//         time: convertTo24Hour(formData.time),
//         serviceId: formData.serviceId
//       }, token);

//       setBookingDetails({
//         ...formData,
//         appointmentId: response.appointmentId
//       });
//       setShowConfirmation(true);
//     } catch (error) {
//       console.error('Booking failed:', error);
//       setError(error.message || 'Failed to book appointment. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleServiceSelect = (service) => {
//     setFormData({
//       ...formData,
//       service: service.name,
//       serviceId: service.id,
//       duration: service.duration,
//       price: service.price,
//       time: ''
//     });
//     setIsServicePickerOpen(false);
//   };

//   const handleConfirmationClose = () => {
//     setShowConfirmation(false);
//     setFormData({
//       service: '',
//       serviceId: null,
//       stylist: '',
//       date: '',
//       time: '',
//       notes: '',
//       duration: '',
//       price: ''
//     });
//   };

//   const formatDisplayDate = (dateString) => {
//     const options = { weekday: 'short', month: 'short', day: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

import { useState, useEffect } from "react";
import axios from "axios";
import {
  FiCalendar,
  FiClock,
  FiScissors,
  FiX,
  FiInfo,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// const API_BASE_URL =
//   "https://nvsalonbackend.dockyardsoftware.com/api/Appointment";
// const SERVICE_API_URL =
//   "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth";

// https://localhost:7014/api/Appointment
// https://localhost:7014/api/AdminAuth
const API_BASE_URL =
  "https://nvsalonbackend.dockyardsoftware.com/api/Appointment";
const SERVICE_API_URL =
  "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth";

const bookAppointment = async (appointmentData, token) => {
  if (!token) throw new Error("Authentication required. Please log in.");

  const payload = {
    AppointmentDate: appointmentData.date,
    AppointmentTime: appointmentData.time,
    ServiceTypeIds: appointmentData.serviceIds,
    AppointmentNotes: appointmentData.notes,
    // StaffId: Number(appointmentData.stylistId)
  };

  console.log("Booking Payload:", payload); // Debug

  const response = await fetch(`${API_BASE_URL}/book`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401)
    throw new Error("Authentication required. Please log in.");
  if (!response.ok)
    throw new Error((await response.text()) || "Failed to book appointment");
  return await response.json();
};

// const getAvailableSlots = async (date, duration) => {
//   const response = await fetch(`${API_BASE_URL}/availability?date=${encodeURIComponent(date)}&duration=${duration}`);
//   if (!response.ok) throw new Error(`Failed to fetch available slots: ${await response.text()}`);

//   const data = await response.json();
//   const slots = Array.isArray(data) ? data : data.$values;
//   const today = new Date().toISOString().split('T')[0];
//   const now = new Date();

//   return slots.filter(slot => {
//     if (date !== today) return true;
//     const [slotHours, slotMinutes] = slot.split(':').map(Number);
//     const slotDateTime = new Date();
//     slotDateTime.setHours(slotHours, slotMinutes, 0, 0);
//     return slotDateTime > now;
//   }).map(slot => formatTimeForDisplay(slot));

// };

// const getAvailableSlots = async (date, duration, staffId) => {
// const response = await fetch(`${API_BASE_URL}/GetAvailableSlots`, {
// method: 'GET',
// headers: {
// 'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     appointmentDate: date,
//     duration: duration,
//     staffId: staffId
//   })
// });

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

const formatTimeForDisplay = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// const getDurationInMinutes = (duration) => {
//   if (!duration) return 0;
//   const [value, unit] = duration.split(' ');
//   return unit.includes('hour') ? parseInt(value) * 60 : parseInt(value);
// };

const convertTo24Hour = (input) => {
  if (!input) return null;

  // If it's already 24h like "9:00" or "09:00" or "09:00:00"
  if (!/\s(AM|PM)$/i.test(input)) {
    const [h = "00", m = "00", s = "00"] = String(input).split(":");
    const hh = String(h).padStart(2, "0");
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
  }

  // If it's 12h like "9:00 AM" or "09:00 PM"
  const [time, modifierRaw] = input.trim().split(" ");
  const modifier = modifierRaw.toUpperCase();
  let [h, m] = time.split(":");

  if (modifier === "PM" && h !== "12") h = String(Number(h) + 12);
  if (modifier === "AM" && h === "12") h = "00";

  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${hh}:${mm}:00`;
};

// const AddBooking = () => {
//   const [formData, setFormData] = useState({
//     service: '', serviceId: null,
//     stylist: '', stylistId: null,
//     date: '', time: '', notes: '', duration: '', price: ''
//   });
const AddBooking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    service: "",
    serviceId: null,
    selectedServices: [],
    date: "",
    time: "",
    notes: "",
    duration: "1 hour",
    price: "",
  });

  const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
  // const [isStylistPickerOpen, setIsStylistPickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [stylists, setStylists] = useState([]);
  const [services, setServices] = useState([]);

  const toggleService = (service) => {
    setFormData((prev) => {
      const exists = prev.selectedServices.some((s) => s.Id === service.Id);
      const nextSelected = exists
        ? prev.selectedServices.filter((s) => s.Id !== service.Id)
        : [...prev.selectedServices, service];

      // derive label + single-id fields for compatibility
      const label =
        nextSelected.length === 0
          ? ""
          : nextSelected.length === 1
          ? nextSelected[0].Name
          : "Custom";

      const singleId = nextSelected.length === 1 ? nextSelected[0].Id : null;

      // sum price
      const totalPrice = nextSelected.reduce(
        (sum, s) => sum + Number(s.Price || 0),
        0
      );

      return {
        ...prev,
        selectedServices: nextSelected,
        service: label,
        serviceId: singleId,
        price: totalPrice,
        // time: "",
        notes: "",
        // duration: "1 hour",
      };
    });
  };
  // show label for the trigger
  const serviceLabel = () =>
    formData.selectedServices.length === 0
      ? "Select Services"
      : formData.selectedServices.length === 1
      ? formData.selectedServices[0].Name
      : "Custom";

  // currency display
  const finalFormatLKR = (v) =>
    Number(v || 0).toLocaleString("en-LK", {
      style: "currency",
      currency: "LKR",
    });
  const formatLKR = (v) => {
  const num = Number(v || 0);
  if (isNaN(num)) return "0.00 (LKR)";

  return (
    num.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " (LKR)"
  );
};

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${SERVICE_API_URL}/active-services`);
        console.log(response.data);
        setServices(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch servcies ",
          error.message || error || error.msg
        );
      }
    };
    fetchServices();
  }, []);

  // Payment states
  // const [showPayment, setShowPayment] = useState(false);
  // const [paymentMethod, setPaymentMethod] = useState('');
  // const [cardDetails, setCardDetails] = useState({
  //   number: '',
  //   expiry: '',
  //   cvv: ''
  // });
  // const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // const [paymentSuccess, setPaymentSuccess] = useState(false);

  // const services = [
  //   { name: 'Haircut', duration: '30 mins', price: 'Rs.3,500', id: 1 },
  //   { name: 'Coloring', duration: '2 hours', price: 'Rs.1,200', id: 2 },
  //   { name: 'Styling', duration: '45 mins', price: 'Rs.5,000', id: 3 },
  //   { name: 'Manicure', duration: '1 hour', price: 'Rs.4,000', id: 4 },
  //   { name: 'Pedicure', duration: '1 hour', price: 'Rs.4,500', id: 5 },
  //   { name: 'Facial', duration: '2.5 hours', price: 'Rs.15,500', id: 6 },
  //   { name: 'Waxing', duration: '3 hours', price: 'Rs.10,800', id: 7 },
  //   { name: 'Makeup', duration: '1 hour', price: 'Rs.8,000', id: 8 },
  //   {name:'Custom', duration:'2 hours', price: 'Rs.0', id:9}

  // ];

  // useEffect(() => {
  //   const fetchStylists = async () => {
  //     try {
  //       const res = await fetch(STAFF_API_URL);
  //       const data = await res.json();
  //       const staffList = Array.isArray(data.staff) ? data.staff.map(s => ({ id: s.Id, name: s.Name, role: s.Role })) : [];
  //       setStylists(staffList);
  //       console.log("Stylists fetched:", staffList);
  //     } catch (err) {
  //       console.error('Failed to fetch stylists:', err);
  //     }
  //   };
  //   fetchStylists();
  // }, []);

  // useEffect(() => {
  //   if (formData.date && formData.duration) calculateAvailableSlots();
  // }, [formData.date, formData.duration]);

  // useEffect(() => {
  //   if (formData.date && formData.duration && formData.stylistId)
  //     calculateAvailableSlots();
  // }, [formData.date, formData.duration, formData.stylistId]);

  useEffect(() => {
    if (formData.date && formData.duration) calculateAvailableSlots();
  }, [formData.date, formData.duration]);

  // const calculateAvailableSlots = async () => {
  //   setIsLoadingSlots(true);
  //   setFormData(prev => ({ ...prev, time: '' }));
  //   setError(null);
  //   try {
  //     const slots = await getAvailableSlots(formData.date, getDurationInMinutes(formData.duration));
  //     setAvailableSlots(slots);
  //   } catch (error) {
  //     setError('Failed to load available time slots. Please try again.');
  //     setAvailableSlots([]);
  //   } finally {
  //     setIsLoadingSlots(false);
  //   }
  // };

  const calculateAvailableSlots = async () => {
    setIsLoadingSlots(true);
    setFormData((prev) => ({ ...prev, time: "" }));
    setError(null);
    const duration = getDurationInMinutes(formData.duration); //60
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

  // Formats a Date or date-string to "YYYY-MM-DD"
const formatDateToYMD = (input) => {
  if (!input) return "";

  // If it's already in "YYYY-MM-DD" form, just return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return input;
  }

  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) {
    console.error("Invalid date passed to formatDateToYMD:", input);
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 01-12
  const day = String(date.getDate()).padStart(2, "0");        // 01-31

  return `${year}-${month}-${day}`;
};

  // const handlePaymentSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsProcessingPayment(true);
  //   setError(null);

  // Simulate payment processing
  //   try {
  //     // In a real app, you would call your payment API here
  //     await new Promise(resolve => setTimeout(resolve, 2000));

  //     // Simulate random s4uccess (90% success rate for demo)
  //     const isSuccess = Math.random() > 0.1;

  //     if (isSuccess) {
  //       setPaymentSuccess(true);
  //       // In a real app, you would update the booking status in your backend
  //     } else {
  //       throw new Error('Payment failed. Please try another payment method.');
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   } finally {
  //     setIsProcessingPayment(false);
  //   }
  // };

  // const handlePaymentMethodSelect = (method) => {
  //   setPaymentMethod(method);
  //   setError(null);
  // };

  // const handleCardInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setCardDetails(prev => ({
  //     ...prev,
  //     [name]: value
  //   }));
  // };

  // const formatCardNumber = (value) => {
  //   const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  //   const matches = v.match(/\d{4,16}/g);
  //   const match = matches && matches[0] || '';
  //   const parts = [];

  //   for (let i = 0, len = match.length; i < len; i += 4) {
  //     parts.push(match.substring(i, i + 4));
  //   }

  //   if (parts.length) {
  //     return parts.join(' ');
  //   } else {
  //     return value;
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // basic validation (treat as failure → Swal)
    if (
      formData.selectedServices.length === 0 ||
      !formData.date ||
      !formData.time
    ) {
      await Swal.fire({
        title: "Missing information",
        html: "<div class='text-left text-gray-200'>Pick at least one service, a date, and a time.</div>",
        icon: "error",
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });
      return;
    }

    // Validate service selected
    // if (!formData.serviceId || formData.serviceId === 0) {
    //   setError('Please select a service.');
    //   setIsSubmitting(false);
    //   return;
    // }

    // Validate stylist selected
    // if (!formData.stylistId || formData.stylistId === 0) {
    //   setError('Please select a stylist.');
    //   setIsSubmitting(false);
    //   return;
    // }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required. Please log in.");

      const response = await bookAppointment(
        {
          date: formData.date,
          time: convertTo24Hour(formData.time),
          serviceIds: formData.selectedServices.map((s) => Number(s.Id)),
          notes: formData.notes || null,
        },
        token
      );

      // setBookingDetails({
      //   ...formData,
      //   appointmentId: response.appointmentId,
      //   service:
      //     formData.selectedServices.length === 1
      //       ? formData.selectedServices[0].Name
      //       : "Custom",
      // });
      const serviceNames = formData.selectedServices.map((s) => s.Name);
      const priceBreakdown = formData.selectedServices.map((s) => ({
        name: s.Name,
        price: Number(s.Price || 0),
      }));
      const totalPrice = priceBreakdown.reduce((sum, i) => sum + i.price, 0);

      setBookingDetails({
        ...formData,
        appointmentId: response.appointmentId,
        // keep a single string for the "Service" line (comma-separated if >1)
        service:
          serviceNames.length === 1 ? serviceNames[0] : serviceNames.join(", "),
        // extra fields used only by the modal UI below
        priceBreakdown,
        totalPrice,
      });
      setShowConfirmation(true);
    } catch (error) {
      setError(
        error.message || "Failed to book appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceSelect = (service) => {
    setFormData({
      ...formData,
      service: service.Name,
      serviceId: service.Id,
      // duration: "60",
      price: service.Price,
      // time: "",
    });
    setIsServicePickerOpen(false);
  };

  // const handleStylistSelect = (stylist) => {
  //   console.log("Stylist selected:", stylist);
  //   setFormData({
  //     ...formData,
  //     stylist: stylist.name,
  //     stylistId: stylist.id
  //   });
  //   setIsStylistPickerOpen(false);
  // };

  // const handleConfirmationClose = () => {
  //   setShowConfirmation(false);
  //   setFormData({ service: '', serviceId: null, stylist: '', stylistId: null, date: '', time: '', notes: '', duration: '', price: '' });
  //   setPaymentSuccess(false);
  //   setPaymentMethod('');
  //   setCardDetails({ number: '', expiry: '', cvv: '' });
  // };

  const handleConfirmationClose = async () => {
    setShowConfirmation(false);
    setFormData({
      service: "",
      serviceId: null,
      selectedServices: [],
      date: "",
      time: "",
      duration: "",
      price: "",
    });
    const REDIRECT_DELAY_MS = 4000; // ~4 seconds to skim details
    await Swal.fire({
      title: "Booking Confirmed!",
      html: `<div class='text-center text-gray-200'>
        Your Appointment no <b>${
          bookingDetails?.appointmentId ?? "N/A"
        }</b> is set.
      </div>`,
      icon: "success",
      background: "#1e1b4b",
      color: "#ffffff",
      confirmButtonText: "Go now",
      showConfirmButton: true,
      timer: REDIRECT_DELAY_MS,
      timerProgressBar: true,
      confirmButtonColor: "#6366f1",
      customClass: { popup: "rounded-xl border-2 border-indigo-500" },
    });

    // then route to bookings page
    navigate("/bookings");

    // setPaymentSuccess(false);
    // setPaymentMethod('');
    // setCardDetails({ number: '', expiry: '', cvv: '' });
  };

  const formatDisplayDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Book an Appointment
        </h2>

        {error && (
          <div className="bg-red-900 text-white p-3 rounded-lg mb-4 flex items-center">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Stylist Picker
          <div 
            className="flex items-center bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition"
            onClick={() => setIsStylistPickerOpen(true)}
          >
            <FiUser className="text-purple-400 mr-3 text-lg" />
            <div className="flex-1">
              <div className="text-sm text-gray-400">Stylist</div>
              <div>{formData.stylist || "Select Stylist"}</div>
            </div>
          </div> */}

          {/* Date Picker Trigger */}
          <div
            className="flex items-center bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition w-full"
            onClick={() => setIsDatePickerOpen(true)}
          >
            <FiCalendar className="text-purple-400 mr-3 text-lg" />
            <div className="flex-1">
              <div className="text-sm text-gray-400">Date</div>
              <div>
                {formData.date
                  ? formatDateToYMD(formData.date)
                  : "Select Date"}
              </div>
            </div>
          </div>

          {/* Time Picker Trigger */}
          <div
            className={`flex items-center bg-gray-700 rounded-lg p-3 transition ${
              formData.date && formData.duration
                ? "cursor-pointer hover:bg-gray-600"
                : "opacity-50"
            }`}
            onClick={() =>
              formData.date && formData.duration && setIsTimePickerOpen(true)
            }
          >
            <FiClock className="text-purple-400 mr-3 text-lg" />
            <div className="flex-1">
              <div className="text-sm text-gray-400">Time</div>
              <div>
                {formData.time ||
                  (formData.date && formData.duration
                    ? "Select Time"
                    : "Select date first")}
              </div>
            </div>
            {/* {formData.duration && (
              <div className="text-gray-400 text-sm">
                {formData.duration}
              </div>
            )} */}
          </div>

          {/* Service Picker Trigger */}
          <div
            className="flex items-center bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition"
            onClick={() => setIsServicePickerOpen(true)}
          >
            <FiScissors className="text-purple-400 mr-3 text-lg" />
            <div className="flex-1">
              <div className="text-sm text-gray-400">Service</div>
              {/* <div>{formData.service || "Select Service"}</div> */}
              <div>{serviceLabel() || "Select Service"}</div>
            </div>
            {/* {formData.price && ( */}
            {formData.selectedServices.length > 0 && (
              <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {/* {formData.price} */}
                {formatLKR(formData.price)}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition">
            <textarea
              name="notes"
              placeholder="Special requests, allergies, or additional notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="bg-transparent w-full focus:outline-none resize-none h-24"
            />
          </div>

          {/* Pricing Summary */}
          {formData.service && (
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-medium mb-2">Booking Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Service:</span>
                  {/* <span>{formData.service}</span> */}
                  <span>
                    {formData.selectedServices.length === 0
                      ? "Not selected"
                      : formData.selectedServices.length === 1
                      ? formData.selectedServices[0].Name
                      : formData.selectedServices
                          .map((service) => service.Name)
                          .join(", ")}
                  </span>
                  {/* formData.selectedServices.map((service) => service.Name).join(', ') */}
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-400">Stylist:</span>
                  <span>{formData.stylist || "Not selected"}</span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-gray-400">Date & Time:</span>
                  <span>
                    {formData.date
                      ? formatDateToYMD(formData.date)
                      : "Not selected"}
                    {formData.time ? ` at ${formData.time}` : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration:</span>
                  <span>{formData.duration || "Not specified"}</span>
                </div>
                <div className="border-t border-gray-600 my-2"></div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  {/* <span>{formData.price || "$0"}</span> */}
                  <span>{finalFormatLKR(formData.price)}</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={
              formData.selectedServices.length === 0 ||
              !formData.date ||
              !formData.time ||
              isSubmitting
            }
            className={`w-full py-3 rounded-lg font-medium transition ${
              // !formData.date || !formData.time || isSubmitting
              formData.selectedServices.length === 0 ||
              !formData.date ||
              !formData.time ||
              isSubmitting
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 text-white"
            }`}
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>

        {/* Service Popup */}
        {isServicePickerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Service</h3>
                <button
                  onClick={() => setIsServicePickerOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {services.map((service) => {
                  const checked = formData.selectedServices.some(
                    (s) => s.Id === service.Id
                  );
                  return (
                    <label
                      key={service.Id}
                      className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition
               ${
                 checked
                   ? "bg-purple-600/20 border-purple-400"
                   : "bg-gray-700 border-gray-600 hover:bg-gray-600"
               }`}
                      onClick={() => toggleService(service)}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          readOnly
                          checked={checked}
                          className="h-4 w-4 rounded border-gray-500"
                        />
                        <span className="font-medium">{service.Name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {formatLKR(service.Price)}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-300">
                  {formData.selectedServices.length > 1
                    ? "Custom"
                    : serviceLabel()}
                  {formData.selectedServices.length > 0 && (
                    <span className="ml-2 text-gray-400">
                      {formatLKR(formData.price)}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsServicePickerOpen(false)}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stylist Popup */}
        {/* {isStylistPickerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Stylist</h3>
                <button 
                  onClick={() => setIsStylistPickerOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div> */}

        {/* <div className="mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 p-2">
                {stylists.length === 0 ? (
                  <div className="text-gray-400 p-3">No stylists available</div>
                ) : (
                  stylists.map(stylist => (
                    <div
                      key={stylist.id}
                      className={`flex items-center p-3 cursor-pointer rounded-md hover:bg-gray-600 transition
                        ${formData.stylistId === stylist.id ? 'bg-purple-700' : ''}`}
                      onClick={() => handleStylistSelect(stylist)}
                    >
                      <FiUser className="text-purple-400 mr-3 text-lg" />
                      <div>{stylist.name}</div>
                    </div>
                  ))
                )}
              </div> */}
        {/* </div>
          </div>
        )} */}

        {/* Time Popup */}
        {isTimePickerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Available Time Slots
                  {isLoadingSlots && (
                    <span className="text-sm text-gray-400 ml-2">
                      Loading...
                    </span>
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
                  No available slots for this date and service duration.
                  <br />
                  Please try another date or service.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 overflow-y-auto flex-1">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, time: slot });
                        setIsTimePickerOpen(false);
                      }}
                      className={`py-3 px-2 rounded-lg transition-all flex flex-col items-center ${
                        formData.time === slot
                          ? "bg-purple-600 text-white border border-purple-400"
                          : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
                      }`}
                    >
                      <span className="text-center">{slot}</span>
                      {/* <span className="text-xs mt-1 opacity-70">
                        {formData.duration}
                      </span> */}
                      {formData.time === slot && <FiCheck className="mt-1" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Date Picker Popup */}
        {isDatePickerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Date</h3>
                <button
                  onClick={() => setIsDatePickerOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4">
                <input
                  type="date"
                  name="date"
                  min={new Date().toISOString().split("T")[0]} // Disable past dates
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      date: e.target.value,
                      time: "",
                    });
                    setIsDatePickerOpen(false);
                  }}
                  className="bg-gray-700 text-white p-2 rounded-lg w-full focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Gateway Popup */}
        {/* {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl border border-purple-500 shadow-2xl p-6 w-full max-w-md relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Complete Your Payment</h3>
                <button 
                  onClick={() => {
                    setShowPayment(false);
                    setShowConfirmation(true);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {!paymentSuccess ? (
                <>
                  <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="font-medium">Total Amount:</div>
                      <div className="text-xl font-bold text-purple-400">{formData.price}</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Select Payment Method</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handlePaymentMethodSelect('card')}
                            className={`p-3 rounded-lg border flex items-center justify-center transition ${
                              paymentMethod === 'card'
                                ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                                : 'border-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            <FiCreditCard className="mr-2" />
                            Credit Card
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePaymentMethodSelect('paypal')}
                            className={`p-3 rounded-lg border flex items-center justify-center transition ${
                              paymentMethod === 'paypal'
                                ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                                : 'border-gray-600 hover:bg-gray-700'
                            }`}
                          >
                            <FiDollarSign className="mr-2" />
                            PayPal
                          </button>
                        </div>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">Card Number</label>
                            <input
                              type="text"
                              name="number"
                              value={formatCardNumber(cardDetails.number)}
                              onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                setCardDetails(prev => ({
                                  ...prev,
                                  number: formatted
                                }));
                              }}
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                              className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">Expiry Date</label>
                              <input
                                type="text"
                                name="expiry"
                                value={cardDetails.expiry}
                                onChange={(e) => {
                                  let value = e.target.value;
                                  if (value.length === 2 && !value.includes('/')) {
                                    value = value + '/';
                                  }
                                  if (value.length <= 5) {
                                    setCardDetails(prev => ({
                                      ...prev,
                                      expiry: value
                                    }));
                                  }
                                }}
                                placeholder="MM/YY"
                                maxLength="5"
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-400 mb-1">CVV</label>
                              <input
                                type="text"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleCardInputChange}
                                placeholder="123"
                                maxLength="3"
                                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {paymentMethod === 'paypal' && (
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
                          <p className="text-gray-400 mb-4">You will be redirected to PayPal to complete your payment</p>
                          <button
                            type="button"
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium py-2 px-4 rounded-lg transition"
                          >
                            Continue to PayPal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-900 text-white p-3 rounded-lg mb-4 flex items-center">
                      <FiAlertCircle className="mr-2" />
                      {error}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={!paymentMethod || (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) || isProcessingPayment}
                    className={`w-full py-3 rounded-lg font-medium transition ${
                      (!paymentMethod || (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) || isProcessingPayment)
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {isProcessingPayment ? 'Processing Payment...' : 'Pay Now'}
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheck className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
                  <p className="text-gray-300 mb-6">Your payment has been processed successfully.</p>
                  <button
                    onClick={() => {
                      setShowPayment(false);
                      setShowConfirmation(true);
                    }}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition"
                  >
                    View Booking Details
                  </button>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* Confirmation Popup */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl sm:rounded-2xl border border-purple-500 shadow-2xl p-5 w-full max-w-md relative flex flex-col justify-between min-h-[540px]">
              {/* Header */}
              <div className="text-center mb-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <FiCheck className="text-white text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-0.5 leading-tight">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-300 text-xs leading-snug">
                  Your appointment has been set successfully
                </p>
              </div>

              {/* Summary card */}
              <div className="bg-gray-700 rounded-lg p-3 mb-3">
                <div className="space-y-1.5 text-[13px] leading-tight">
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-400">Service:</span>
                    <span className="font-medium text-right">
                      {bookingDetails?.service}
                    </span>
                  </div>

                  {bookingDetails?.priceBreakdown?.length === 1 && (
                    <div className="flex justify-between gap-3">
                      <span className="text-gray-400">Price:</span>
                      <span className="font-medium text-right">
                        {formatLKR(bookingDetails.priceBreakdown[0].price)}
                      </span>
                    </div>
                  )}
                  {bookingDetails?.priceBreakdown?.length > 1 && (
                    <>
                      <div className="text-gray-400 mt-1 text-[13px]">
                        Prices
                      </div>

                      {/* indented, slightly padded panel */}
                      <div className="mt-1  rounded-md  py-2">
                        <div className="space-y-1">
                          {bookingDetails.priceBreakdown.map((item) => (
                            <div
                              key={item.name}
                              className="flex justify-between gap-5 text-xs"
                            >
                              <span className="text-gray-200">{item.name}</span>
                              <span className="font-medium">
                                {formatLKR(item.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-400">Date:</span>
                    <span className="font-medium text-right">
                      {bookingDetails?.date &&
                        formatDateToYMD(bookingDetails.date)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-400">Time:</span>
                    <span className="font-medium text-right">
                      {bookingDetails?.time}
                    </span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-medium text-right">
                      {bookingDetails?.duration}
                    </span>
                  </div>

                  <div className="border-t border-gray-600 my-1.5"></div>

                  <div className="flex justify-between items-center text-sm">
                    <span>Total:</span>
                    <span className="font-semibold text-purple-400">
                      {finalFormatLKR(
                        bookingDetails?.totalPrice ?? bookingDetails?.price
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reminder */}
              <div className="bg-gray-750 rounded-lg p-2 mb-3 flex items-start">
                <FiInfo className="text-purple-400 mt-[1px] mr-2 flex-shrink-0" />
                <div className="text-[12px] leading-snug">
                  <h4 className="font-medium text-sm mb-0.5">
                    Important Reminder
                  </h4>
                  <p className="text-gray-400">
                    Please arrive 10 minutes before your appointment.
                    Cancellations within 24 hours may incur a fee.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex">
                <button
                  onClick={handleConfirmationClose}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 text-sm rounded-lg font-medium transition"
                >
                  Done
                </button>
              </div>

              <button
                onClick={handleConfirmationClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-white"
                aria-label="Close"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          // <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overscroll-contain">
          //   <div className="bg-gray-800 rounded-xl flex flex-col sm-rounded-2xl border border-purple-500 shadow-2xl p-6 w-full max-h-[90dvh] max-w-md relative">
          //     <div className="text-center mb-6">
          //       <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          //         <FiCheck className="text-white text-2xl" />
          //       </div>
          //       <h3 className="text-2xl font-bold text-white mb-2">
          //         Booking Confirmed!
          //       </h3>
          //       <p className="text-gray-300">
          //         Your appointment has been successfully scheduled
          //       </p>
          //     </div>

          //     <div className="bg-gray-700 rounded-lg p-4 mb-6">
          //       <div className="space-y-3">
          //         <div className="flex justify-between">
          //           <span className="text-gray-400">Service:</span>
          //           <span className="font-medium">
          //             {bookingDetails?.service}
          //           </span>
          //         </div>
          //         {/* <div className="flex justify-between">
          //           <span className="text-gray-400">With:</span>
          //           <span className="font-medium">{bookingDetails?.stylist}</span>
          //         </div> */}
          //         <div className="flex justify-between">
          //           <span className="text-gray-400">Date:</span>
          //           <span className="font-medium">
          //             {bookingDetails?.date &&
          //               formatDisplayDate(bookingDetails.date)}
          //           </span>
          //         </div>
          //         <div className="flex justify-between">
          //           <span className="text-gray-400">Time:</span>
          //           <span className="font-medium">{bookingDetails?.time}</span>
          //         </div>
          //         <div className="flex justify-between">
          //           <span className="text-gray-400">Duration:</span>
          //           <span className="font-medium">
          //             {bookingDetails?.duration}
          //           </span>
          //         </div>
          //         <div className="border-t border-gray-600 my-2"></div>
          //         {/* <div className="flex justify-between">
          //           <span className="text-gray-400">Payment Status:</span>
          //           <span className="font-medium text-green-400">Paid</span>
          //         </div> */}
          //         <div className="flex justify-between text-lg">
          //           <span>Total:</span>
          //           <span className="font-bold text-purple-400">
          //             LKR {bookingDetails?.price}
          //           </span>
          //         </div>
          //       </div>
          //     </div>

          //     <div className="bg-gray-750 rounded-lg p-3 mb-6 flex items-start">
          //       <FiInfo className="text-purple-400 mt-1 mr-3 flex-shrink-0" />
          //       <div>
          //         <h4 className="font-medium mb-1">Important Reminder</h4>
          //         <p className="text-sm text-gray-400">
          //           Please arrive 10 minutes before your appointment.
          //           Cancellations within 24 hours may incur a fee.
          //         </p>
          //       </div>
          //     </div>

          //     <div className="flex space-x-3">
          //       <button
          //         onClick={handleConfirmationClose}

          //         className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition"
          //       >
          //         Done
          //       </button>
          //     </div>

          //     <button
          //       onClick={handleConfirmationClose}
          //       className="absolute top-4 right-4 text-gray-400 hover:text-white"
          //     >
          //       <FiX className="h-5 w-5" />
          //     </button>
          //   </div>
          // </div>
        )}
      </div>
    </div>
  );
};

export default AddBooking;

// import { useState, useEffect } from 'react';
// import { FiCalendar, FiClock, FiScissors, FiUser, FiX, FiInfo, FiCheck, FiAlertCircle } from 'react-icons/fi';
// import Swal from 'sweetalert2';

// // API Service Functions
// const API_BASE_URL = 'https://saloonbackend.dockyardsoftware.com/api/Appointment';

// const bookAppointment = async (appointmentData, token) => {
//   if (!token) {
//     throw new Error('Authentication required. Please log in.');
//   }

//   console.log('Token sent for booking:', token);

//   const response = await fetch(`${API_BASE_URL}/book`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//     body: JSON.stringify({
//       AppointmentDate: appointmentData.date,
//       AppointmentTime: appointmentData.time,
//       ServiceTypeIds: [appointmentData.serviceId]
//     })
//   });

//   if (response.status === 401) {
//     throw new Error('Authentication required. Please log in.');
//   }

//   if (!response.ok) {
//     const error = await response.text();
//     throw new Error(error || 'Failed to book appointment');
//   }

//   return await response.json();
// };

// const getAvailableSlots = async (date, duration) => {
//   try {
//     console.log("Requesting available slots for date:", date, "duration:", duration);

//     const response = await fetch(`${API_BASE_URL}/availability?date=${encodeURIComponent(date)}&duration=${duration}`);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Server Error:', errorText);
//       throw new Error(`Failed to fetch available slots: ${errorText}`);
//     }

//     const data = await response.json();
//     console.log('🟢 Raw backend response:', data);

//     const slots = Array.isArray(data) ? data : data.$values;

//     if (!slots || !Array.isArray(slots)) {
//       throw new Error(`Expected an array of slots but got: ${JSON.stringify(data)}`);
//     }

//     // Filter out past times if selected date is today
//     const today = new Date().toISOString().split('T')[0];
//     const now = new Date();

//     const filteredSlots = slots.filter(slot => {
//       if (date !== today) return true;
//       const [slotHours, slotMinutes] = slot.split(':').map(Number);
//       const slotDateTime = new Date();
//       slotDateTime.setHours(slotHours, slotMinutes, 0, 0);
//       return slotDateTime > now;
//     });

//     return filteredSlots.map(slot => formatTimeForDisplay(slot));
//   } catch (err) {
//     console.error('getAvailableSlots Error:', err.message);
//     throw err;
//   }
// };

// // Helper functions
// const formatTimeForDisplay = (time24) => {
//   const [hours, minutes] = time24.split(':');
//   const hour = parseInt(hours);
//   const ampm = hour >= 12 ? 'PM' : 'AM';
//   const hour12 = hour % 12 || 12;
//   return `${hour12}:${minutes} ${ampm}`;
// };

const getDurationInMinutes = (duration) => {
  if (!duration) return 0;
  if (typeof duration === "number") return duration;

  const raw = String(duration).trim().toLowerCase();

  // handle plain numbers like "60"
  if (/^\d+$/.test(raw)) return parseInt(raw, 10);

  const [valueStr, unit = "min"] = raw.split(/\s+/);
  const value = parseInt(valueStr, 10);
  if (isNaN(value)) return 0;

  if (unit.startsWith("hour")) return value * 60;
  if (unit.startsWith("hr")) return value * 60;
  return value; // min / mins / minutes
  // if (!duration) return 0;
  // const [value, unit] = duration.split(' ');
  // if (unit.includes('hour')) return parseInt(value) * 60;
  // return parseInt(value);
};

// const convertTo24Hour = (time12h) => {
//   const [time, modifier] = time12h.split(' ');
//   let [hours, minutes] = time.split(':');
//   if (hours === '12') hours = '00';
//   if (modifier === 'PM') hours = parseInt(hours) + 12;
//   return `${hours}:${minutes}:00`;
// };

// const formatDisplayDate = (dateString) => {
//   const options = { weekday: 'short', month: 'short', day: 'numeric' };
//   return new Date(dateString).toLocaleDateString('en-US', options);
// };

// const AddBooking = () => {
//   const [formData, setFormData] = useState({
//     service: '',
//     serviceId: null,
//     stylist: '',
//     date: '',
//     time: '',
//     notes: '',
//     duration: '',
//     price: ''
//   });

//   const [isServicePickerOpen, setIsServicePickerOpen] = useState(false);
//   const [isStylistPickerOpen, setIsStylistPickerOpen] = useState(false);
//   const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [isLoadingSlots, setIsLoadingSlots] = useState(false);
//   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Service mapping
//   const services = [
//     { name: 'Haircut', duration: '30 mins', price: 'Rs.3,500', id: 1 },
//     { name: 'Coloring', duration: '2 hours', price: 'Rs.1,200', id: 2 },
//     { name: 'Styling', duration: '45 mins', price: 'Rs.5,000', id: 3 },
//     { name: 'Manicure', duration: '1 hour', price: 'Rs.4,000', id: 4 },
//     { name: 'Pedicure', duration: '1 hour', price: 'Rs.4,500', id: 5 },
//     { name: 'Full Set', duration: '2.5 hours', price: 'Rs.15,500', id: 6 },
//     { name: 'Highlights', duration: '3 hours', price: 'Rs.10,800', id: 7 },
//     { name: 'Facial', duration: '1 hour', price: 'Rs.8,000', id: 8 }
//   ];

//   const stylists = [
//     { name: 'Rayan Pranandu', specialty: 'Coloring', rating: '4.9' },
//     { name: 'Michael Smith', specialty: 'Haircut', rating: '4.8' },
//     { name: 'Sahini Abecone', specialty: 'Styling', rating: '4.7' },
//     { name: 'David Frenando', specialty: 'Manicure', rating: '4.9' },
//     { name: 'Charith Silva', specialty: 'Facial', rating: '5.0' },
//     { name: 'Naduni Abecone', specialty: 'Styling', rating: '4.7' },
//     { name: 'Uvin Frenando', specialty: 'Manicure', rating: '4.9' },
//     { name: 'Anura Silva', specialty: 'Facial', rating: '5.0' }
//   ];

//   useEffect(() => {
//     if (formData.date && formData.duration) {
//       calculateAvailableSlots();
//     }
//   }, [formData.date, formData.duration]);

//   const calculateAvailableSlots = async () => {
//     setIsLoadingSlots(true);
//     setFormData(prev => ({ ...prev, time: '' }));

//     try {
//       const slots = await getAvailableSlots(formData.date, getDurationInMinutes(formData.duration));
//       setAvailableSlots(slots);
//     } catch (error) {
//       console.error('Error fetching slots:', error);
//       Swal.fire({
//         title: 'Error',
//         text: 'Failed to load available time slots. Please try again.',
//         icon: 'error',
//         confirmButtonColor: '#7c3aed',
//         background: '#1f2937',
//         color: '#f3f4f6',
//       });
//       setAvailableSlots([]);
//     } finally {
//       setIsLoadingSlots(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Validate required fields
//       if (!formData.service || !formData.date || !formData.time) {
//         await Swal.fire({
//           title: 'Missing Information',
//           text: 'Please select a service, date, and time before booking.',
//           icon: 'warning',
//           confirmButtonColor: '#7c3aed',
//           background: '#1f2937',
//           color: '#f3f4f6',
//         });
//         return;
//       }

//       const token = localStorage.getItem('token');

//       if (!token) {
//         const result = await Swal.fire({
//           title: 'Login Required',
//           text: 'You need to be logged in to book an appointment.',
//           icon: 'warning',
//           confirmButtonColor: '#7c3aed',
//           background: '#1f2937',
//           color: '#f3f4f6',
//           showCancelButton: true,
//           cancelButtonColor: '#6b7280',
//           confirmButtonText: 'Go to Login',
//           cancelButtonText: 'Cancel'
//         });

//         if (result.isConfirmed) {
//           window.location.href = '/login';
//         }
//         return;
//       }

//       // Show booking confirmation
//       const confirmation = await Swal.fire({
//         title: 'Confirm Booking',
//         html: `
//           <div class="text-left text-gray-200">
//             <p><strong>Service:</strong> ${formData.service}</p>
//             <p><strong>Date:</strong> ${formatDisplayDate(formData.date)}</p>
//             <p><strong>Time:</strong> ${formData.time}</p>
//             <p><strong>Price:</strong> ${formData.price}</p>
//           </div>
//         `,
//         icon: 'question',
//         showCancelButton: true,
//         confirmButtonColor: '#7c3aed',
//         cancelButtonColor: '#6b7280',
//         confirmButtonText: 'Confirm Booking',
//         cancelButtonText: 'Cancel',
//         background: '#1f2937',
//         color: '#f3f4f6',
//       });

//       if (!confirmation.isConfirmed) {
//         setIsSubmitting(false);
//         return;
//       }

//       // Process booking
//       const response = await bookAppointment({
//         date: formData.date,
//         time: convertTo24Hour(formData.time),
//         serviceId: formData.serviceId
//       }, token);

//       // Show success message
//       await Swal.fire({
//         title: 'Booking Confirmed!',
//         html: `
//           <div class="text-left text-gray-200">
//             <p>Your appointment has been successfully scheduled.</p>
//             <p><strong>Service:</strong> ${formData.service}</p>
//             <p><strong>Date:</strong> ${formatDisplayDate(formData.date)}</p>
//             <p><strong>Time:</strong> ${formData.time}</p>
//             <p><strong>Reference ID:</strong> ${response.appointmentId || 'N/A'}</p>
//           </div>
//         `,
//         icon: 'success',
//         confirmButtonColor: '#7c3aed',
//         background: '#1f2937',
//         color: '#f3f4f6',
//       });

//       // Reset form
//       setFormData({
//         service: '',
//         serviceId: null,
//         stylist: '',
//         date: '',
//         time: '',
//         notes: '',
//         duration: '',
//         price: ''
//       });

//     } catch (error) {
//       console.error('Booking failed:', error);
//       await Swal.fire({
//         title: 'Booking Failed',
//         text: error.message || 'Failed to book appointment. Please try again.',
//         icon: 'error',
//         confirmButtonColor: '#7c3aed',
//         background: '#1f2937',
//         color: '#f3f4f6',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleServiceSelect = (service) => {
//     setFormData({
//       ...formData,
//       service: service.name,
//       serviceId: service.id,
//       duration: service.duration,
//       price: service.price,
//       time: ''
//     });
//     setIsServicePickerOpen(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
//       <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
//         <h2 className="text-2xl font-bold mb-6 text-center">Book an Appointment</h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Service Picker Trigger */}
//           <div
//             className="flex items-center bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition"
//             onClick={() => setIsServicePickerOpen(true)}
//           >
//             <FiScissors className="text-purple-400 mr-3 text-lg" />
//             <div className="flex-1">
//               <div className="text-sm text-gray-400">Service</div>
//               <div>{formData.service || "Select Service"}</div>
//             </div>
//             {formData.price && (
//               <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
//                 {formData.price}
//               </div>
//             )}
//           </div>

//           {/* Stylist Picker Trigger */}
//           <div
//             className="flex items-center bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition"
//             onClick={() => setIsStylistPickerOpen(true)}
//           >
//             <FiUser className="text-purple-400 mr-3 text-lg" />
//             <div className="flex-1">
//               <div className="text-sm text-gray-400">Stylist</div>
//               <div>{formData.stylist || "Select Stylist"}</div>
//             </div>
//           </div>

//           {/* Date Picker Trigger */}
//           <div
//             className="flex items-center bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition w-full"
//             onClick={() => setIsDatePickerOpen(true)}
//           >
//             <FiCalendar className="text-purple-400 mr-3 text-lg" />
//             <div className="flex-1">
//               <div className="text-sm text-gray-400">Date</div>
//               <div>{formData.date ? formatDisplayDate(formData.date) : "Select Date"}</div>
//             </div>
//           </div>

//           {/* Time Picker Trigger */}
//           <div
//             className={`flex items-center bg-gray-700 rounded-lg p-3 transition ${
//               formData.date && formData.duration ? 'cursor-pointer hover:bg-gray-600' : 'opacity-50'
//             }`}
//             onClick={() => formData.date && formData.duration && setIsTimePickerOpen(true)}
//           >
//             <FiClock className="text-purple-400 mr-3 text-lg" />
//             <div className="flex-1">
//               <div className="text-sm text-gray-400">Time</div>
//               <div>
//                 {formData.time || (
//                   formData.date && formData.duration ? "Select Time" : "Select date and service first"
//                 )}
//               </div>
//             </div>
//             {formData.duration && (
//               <div className="text-gray-400 text-sm">
//                 {formData.duration}
//               </div>
//             )}
//           </div>

//           {/* Notes */}
//           <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition">
//             <textarea
//               name="notes"
//               placeholder="Special requests, allergies, or additional notes"
//               value={formData.notes}
//               onChange={(e) => setFormData({...formData, notes: e.target.value})}
//               className="bg-transparent w-full focus:outline-none resize-none h-24"
//             />
//           </div>

//           {/* Pricing Summary */}
//           {formData.service && (
//             <div className="bg-gray-700 rounded-lg p-4">
//               <h3 className="font-medium mb-2">Booking Summary</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Service:</span>
//                   <span>{formData.service}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Stylist:</span>
//                   <span>{formData.stylist || "Not selected"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Date & Time:</span>
//                   <span>
//                     {formData.date ? formatDisplayDate(formData.date) : "Not selected"}
//                     {formData.time ? ` at ${formData.time}` : ""}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">Duration:</span>
//                   <span>{formData.duration || "Not specified"}</span>
//                 </div>
//                 <div className="border-t border-gray-600 my-2"></div>
//                 <div className="flex justify-between font-medium">
//                   <span>Total:</span>
//                   <span>{formData.price || "$0"}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={!formData.service || !formData.date || !formData.time || isSubmitting}
//             className={`w-full py-3 rounded-lg font-medium transition ${
//               (!formData.service || !formData.date || !formData.time || isSubmitting)
//                 ? "bg-gray-600 text-gray-400 cursor-not-allowed"
//                 : "bg-purple-600 hover:bg-purple-700 text-white"
//             }`}
//           >
//             {isSubmitting ? 'Booking...' : 'Confirm Booking'}
//           </button>
//         </form>

//         {/* Service Popup */}
//         {isServicePickerOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">Select Service</h3>
//                 <button
//                   onClick={() => setIsServicePickerOpen(false)}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   <FiX className="h-5 w-5" />
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 gap-3 overflow-y-auto flex-1">
//                 {services.map((service) => (
//                   <button
//                     key={service.id}
//                     type="button"
//                     onClick={() => handleServiceSelect(service)}
//                     className={`py-3 px-4 rounded-lg transition-all text-left ${
//                       formData.service === service.name
//                         ? "bg-purple-600 text-white border border-purple-400"
//                         : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
//                     }`}
//                   >
//                     <div className="font-medium">{service.name}</div>
//                     <div className="flex justify-between text-sm mt-1">
//                       <span className="text-gray-300">{service.duration}</span>
//                       <span className="font-medium">{service.price}</span>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Stylist Popup */}
//         {isStylistPickerOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">Select Stylist</h3>
//                 <button
//                   onClick={() => setIsStylistPickerOpen(false)}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   <FiX className="h-5 w-5" />
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 gap-3 overflow-y-auto flex-1">
//                 {stylists.map((stylist) => (
//                   <button
//                     key={stylist.name}
//                     type="button"
//                     onClick={() => {
//                       setFormData({...formData, stylist: stylist.name});
//                       setIsStylistPickerOpen(false);
//                     }}
//                     className={`py-3 px-4 rounded-lg transition-all text-left ${
//                       formData.stylist === stylist.name
//                         ? "bg-purple-600 text-white border border-purple-400"
//                         : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
//                     }`}
//                   >
//                     <div className="font-medium">{stylist.name}</div>
//                     <div className="flex justify-between text-sm mt-1">
//                       <span className="text-gray-300">Specialty: {stylist.specialty}</span>
//                       <span className="flex items-center">
//                         ⭐ {stylist.rating}
//                       </span>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Time Popup */}
//         {isTimePickerOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">
//                   Available Time Slots
//                   {isLoadingSlots && <span className="text-sm text-gray-400 ml-2">Loading...</span>}
//                 </h3>
//                 <button
//                   onClick={() => setIsTimePickerOpen(false)}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   <FiX className="h-5 w-5" />
//                 </button>
//               </div>

//               {availableSlots.length === 0 && !isLoadingSlots ? (
//                 <div className="text-center py-8 text-gray-400">
//                   No available slots for this date and service duration.
//                   <br />
//                   Please try another date or service.
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-2 gap-3 overflow-y-auto flex-1">
//                   {availableSlots.map((slot) => (
//                     <button
//                       key={slot}
//                       type="button"
//                       onClick={() => {
//                         setFormData({...formData, time: slot});
//                         setIsTimePickerOpen(false);
//                       }}
//                       className={`py-3 px-2 rounded-lg transition-all flex flex-col items-center ${
//                         formData.time === slot
//                           ? "bg-purple-600 text-white border border-purple-400"
//                           : "bg-gray-700 hover:bg-gray-600 border border-gray-600"
//                       }`}
//                     >
//                       <span className="text-center">{slot}</span>
//                       <span className="text-xs mt-1 opacity-70">
//                         {formData.duration}
//                       </span>
//                       {formData.time === slot && (
//                         <FiCheck className="mt-1" />
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Date Picker Popup */}
//         {isDatePickerOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl p-6 w-full max-w-md max-h-[90vh] flex flex-col">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">Select Date</h3>
//                 <button
//                   onClick={() => setIsDatePickerOpen(false)}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   <FiX className="h-5 w-5" />
//                 </button>
//               </div>

//               <div className="p-4">
//                 <input
//                   type="date"
//                   name="date"
//                   min={new Date().toISOString().split('T')[0]}
//                   value={formData.date}
//                   onChange={(e) => {
//                     setFormData({...formData, date: e.target.value, time: ''});
//                     setIsDatePickerOpen(false);
//                   }}
//                   className="bg-gray-700 text-white p-2 rounded-lg w-full focus:outline-none"
//                   required
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AddBooking;
