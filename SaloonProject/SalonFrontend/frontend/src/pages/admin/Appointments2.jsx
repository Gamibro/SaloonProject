// // import { useState, useEffect } from 'react';
// // import { FiSearch, FiFilter } from 'react-icons/fi';
// // // import AdminAppointmentList from '../../components/Appointment/AdminAppointmentList';
// // import StaffAssignment from '../../components/Stylist/StaffAssignment';

// // const API_BASE_URL = 'https://saloonbackend.dockyardsoftware.com/api';

// // const AdminAppointmentsPage = () => {
// //   const [appointments, setAppointments] = useState([]);
// //   const [selectedAppointment, setSelectedAppointment] = useState(null);
// //   const [showAssignmentModal, setShowAssignmentModal] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [filter, setFilter] = useState('all');
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [editingId, setEditingId] = useState(null);
// //   const [editDate, setEditDate] = useState('');
// //   const [editTime, setEditTime] = useState('');
// //   const [editStatus, setEditStatus] = useState('');
// //   const [staffList, setStaffList] = useState([]);

// //   // Helper to get staff name by Id from local staffList state
// //   const getStaffNameById = (id) => {
// //     const staff = staffList.find((s) => s.Id === id);
// //     return staff ? staff.Name : 'Unassigned';
// //   };

// //   useEffect(() => {
// //     const fetchStaff = async () => {
// //       const token = localStorage.getItem('token');
// //       if (!token) throw new Error('Authentication token missing');

// //       const response = await fetch(`${API_BASE_URL}/AdminAuth/staffview`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (!response.ok) throw new Error('Failed to fetch staff');

// //       const data = await response.json();
// //       const staffs = data.staff || [];
// //       setStaffList(staffs);
// //       return staffs;
// //     };

// //  const fetchAppointments = async () => {
// //   const token = localStorage.getItem('token');
// //   if (!token) throw new Error('Authentication token missing');

// //   const response = await fetch(`${API_BASE_URL}/Appointment/all`, {
// //     headers: { Authorization: `Bearer ${token}` },
// //   });

// //   if (!response.ok) throw new Error(`Failed to fetch appointments: ${response.statusText}`);

// //   const data = await response.json();

// //   const mappedAppointments = data.map(appt => ({
// //     id: appt.Id,
// //     client: appt.User?.Name || appt.UserName || 'N/A',
// //     service: appt.ServiceName || 'N/A',

// //     date: appt.AppointmentDate ? new Date(appt.AppointmentDate).toISOString().split('T')[0] : 'N/A',
// //     time: appt.AppointmentTime || 'N/A',
// //     status: appt.Status || 'N/A',
// //     staffId: appt.StaffId || null,
// //     assignedTo: appt.StaffId ? `Staff ID: ${appt.StaffId}` : 'Unassigned',
// //     userName: appt.User?.UserName || appt.UserName || '',
// //     price: appt.Price || 0,
// //   }));

// //   setAppointments(mappedAppointments);
// // };

// //     const loadData = async () => {
// //       setLoading(true);
// //       setError(null);
// //       try {
// //         const staffs = await fetchStaff();
// //         await fetchAppointments(staffs);
// //       } catch (err) {
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     loadData();
// //   }, []);

// //   const filteredAppointments = appointments
// //     .filter(appt =>
// //       (filter === 'all' || appt.status.toLowerCase() === filter.toLowerCase()) &&
// //       (appt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //         appt.service.toLowerCase().includes(searchTerm.toLowerCase()))
// //     );

// //   const handleAssignStaff = (appointment) => {
// //     setSelectedAppointment(appointment);
// //     setShowAssignmentModal(true);
// //   };

// //   // Delete appointment
// //   const handleDelete = async (appointmentId) => {
// //     const token = localStorage.getItem('token');
// //     if (!token) return;
// //     if (!window.confirm('Are you sure you want to delete this appointment?')) return;

// //     try {
// //       const response = await fetch(`${API_BASE_URL}/Appointment/${appointmentId}`, {
// //         method: 'DELETE',
// //         headers: { Authorization: `Bearer ${token}` }
// //       });
// //       if (!response.ok) throw new Error('Delete failed');

// //       setAppointments(prev => prev.filter(appt => appt.id !== appointmentId));
// //     } catch (err) {
// //       console.error(err);
// //       alert('Failed to delete appointment');
// //     }
// //   };

// //   // Start editing date/time
// //   const startEditing = (appt) => {
// //     setEditingId(appt.id);
// //     setEditDate(appt.date !== 'N/A' ? appt.date : '');
// //     setEditTime(appt.time !== 'N/A' ? appt.time : '');
// //     setEditStatus(appt.status);
// //   };

// //   // Cancel editing
// //   const cancelEditing = () => {
// //     setEditingId(null);
// //     setEditDate('');
// //     setEditTime('');
// //     setEditStatus('');
// //   };

// //   // Save updated date/time
// //   const saveDateTime = async () => {
// //     const token = localStorage.getItem('token');
// //     if (!token) return;
// //     if (!editDate || !editTime) {
// //       alert('Date and Time cannot be empty');
// //       return;
// //     }

// //     try {
// //       const response = await fetch(`${API_BASE_URL}/Appointment/${editingId}`, {
// //         method: 'PUT',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`
// //         },
// //         body: JSON.stringify({
// //           AppointmentDate: editDate,
// //           AppointmentTime: editTime,
// //         }),
// //       });

// //       if (!response.ok) throw new Error('Failed to update appointment date/time');

// //       setAppointments(prev =>
// //         prev.map(appt =>
// //           appt.id === editingId ? { ...appt, date: editDate, time: editTime } : appt
// //         )
// //       );
// //       cancelEditing();
// //     } catch (err) {
// //       console.error(err);
// //       alert('Failed to update appointment date/time');
// //     }
// //   };

// //   // Update status
// //   const updateStatus = async (appointmentId, userName, newStatus) => {
// //     const token = localStorage.getItem('token');
// //     if (!token) return;

// //     try {
// //       const response = await fetch(`${API_BASE_URL}/AdminAuth/update-appointment-status`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`
// //         },
// //         body: JSON.stringify({
// //           AppointmentId: appointmentId,
// //           UserName: userName,
// //           Status: newStatus,
// //         }),
// //       });

// //       if (!response.ok) throw new Error('Failed to update status');

// //       setAppointments(prev =>
// //         prev.map(appt =>
// //           appt.id === appointmentId ? { ...appt, status: newStatus } : appt
// //         )
// //       );

// //       if (appointmentId === editingId) setEditStatus(newStatus);
// //     } catch (err) {
// //       console.error(err);
// //       alert('Failed to update status');
// //     }
// //   };

// // const handleAssignmentComplete = async (appointmentId, staffId) => {
// //     try {
// //       const token = localStorage.getItem('token');
// //       if (!token) throw new Error('Authentication token missing');

// //       const parsedStaffId = parseInt(staffId);

// //       const response = await fetch(`${API_BASE_URL}/AdminAuth/assign-staff`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({
// //           AppointmentId: appointmentId,
// //           StaffId: parsedStaffId,
// //         }),
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         throw new Error(`Failed to assign staff: ${errorText}`);
// //       }

// //       alert('Staff assigned successfully'); //aaaahh

// //       // Update appointment in state with new staff assignment and staffId
// //       setAppointments((prev) =>
// //         prev.map((appt) =>
// //           appt.id === appointmentId
// //             ? {
// //                 ...appt,
// //                 staffId: parsedStaffId,
// //                 assignedTo: getStaffNameById(parsedStaffId),
// //               }
// //             : appt
// //         )
// //       );

// //       setShowAssignmentModal(false); // Close modal after assignment
// //     } catch (error) {
// //       console.error('Error assigning staff:', error.message);
// //       alert('Error assigning staff: ' + error.message);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-900 text-gray-100">
// //       <div className="max-w-7xl mx-auto px-4 py-8">
// //         <h2 className="text-2xl font-bold mb-8">Manage Appointments</h2>

// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
// //           <div className="relative w-full md:w-64">
// //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
// //               <FiSearch className="text-gray-400" />
// //             </div>
// //             <input
// //               type="text"
// //               placeholder="Search appointments..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //               className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
// //             />
// //           </div>

// //           <div className="flex items-center space-x-4 w-full md:w-auto">
// //             <div className="flex items-center">
// //               <FiFilter className="text-gray-400 mr-2" />
// //               <select
// //                 value={filter}
// //                 onChange={(e) => setFilter(e.target.value)}
// //                 className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
// //               >
// //                 <option value="all">All Statuses</option>
// //                 <option value="pending">Pending</option>
// //                 <option value="confirmed">Confirmed</option>
// //                 <option value="completed">Completed</option>
// //                 <option value="cancelled">Cancelled</option>
// //                 <option value="ongoing">Ongoing</option>
// //               </select>
// //             </div>
// //           </div>
// //         </div>

// //         {loading ? (
// //           <p className="text-center text-gray-400">Loading appointments...</p>
// //         ) : error ? (
// //           <p className="text-center text-red-500">{error}</p>
// //         ) : (
// //           <table className="w-full table-auto border-collapse border border-gray-700">
// //             <thead>
// //               <tr className="bg-gray-800 text-left">
// //                 <th className="border border-gray-700 px-3 py-2">Client</th>
// //                 <th className="border border-gray-700 px-3 py-2">Service</th>
// //                 <th className="border border-gray-700 px-3 py-2">Date</th>
// //                 <th className="border border-gray-700 px-3 py-2">Time</th>
// //                 <th className="border border-gray-700 px-3 py-2">Status</th>
// //                 <th className="border border-gray-700 px-3 py-2">Price</th>
// //                 <th className="border border-gray-700 px-3 py-2">Assigned To</th>
// //                 <th className="border border-gray-700 px-3 py-2">Actions</th>

// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filteredAppointments.map(appt => (
// //                 <tr key={appt.id} className="border border-gray-700 hover:bg-gray-800">
// //                   <td className="border border-gray-700 px-3 py-2">{appt.client}</td>
// //                   <td className="border border-gray-700 px-3 py-2">{appt.service}</td>
// //                   <td className="border border-gray-700 px-3 py-2">
// //                     {editingId === appt.id ? (
// //                       <input
// //                         type="date"
// //                         value={editDate}
// //                         onChange={e => setEditDate(e.target.value)}
// //                         className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-100 w-full"
// //                       />
// //                     ) : (
// //                       appt.date
// //                     )}
// //                   </td>
// //                   <td className="border border-gray-700 px-3 py-2">
// //                     {editingId === appt.id ? (
// //                       <input
// //                         type="time"
// //                         value={editTime}
// //                         onChange={e => setEditTime(e.target.value)}
// //                         className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-100 w-full"
// //                       />
// //                     ) : (
// //                       appt.time
// //                     )}
// //                   </td>
// //                   <td className="border border-gray-700 px-3 py-2">
// //                     {editingId === appt.id ? (
// //                       <select
// //                         value={editStatus}
// //                         onChange={e => {
// //                           setEditStatus(e.target.value);
// //                           updateStatus(appt.id, appt.userName, e.target.value);
// //                         }}
// //                         className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-gray-100 w-full"
// //                       >
// //                         <option value="Pending">Pending</option>

// //                         <option value="Completed">Completed</option>
// //                         <option value="Cancelled">Cancelled</option>
// //                         <option value="Ongoing">Ongoing</option>
// //                       </select>
// //                     ) : (
// //                       appt.status
// //                     )}
// //                   </td>
// //                    <td>
// //                       {appt.price.toLocaleString('en-LK', {
// //                         style: 'currency',
// //                         currency: 'LKR',
// //                       })}
// //                     </td> {/* ✅ Nicely formatted */}

// //                   <td className="border border-gray-700 px-3 py-2">{appt.assignedTo}</td>
// //                   <td className="border border-gray-700 px-3 py-2 space-x-2">
// //                     {editingId === appt.id ? (
// //                       <>
// //                         <button
// //                           onClick={saveDateTime}
// //                           className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
// //                         >
// //                           Save
// //                         </button>
// //                         <button
// //                           onClick={cancelEditing}
// //                           className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
// //                         >
// //                           Cancel
// //                         </button>
// //                       </>
// //                     ) : (
// //                       <>
// //                         <button
// //                           onClick={() => startEditing(appt)}
// //                           className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
// //                         >
// //                           Edit
// //                         </button>
// //                         <button
// //                           onClick={() => handleAssignStaff(appt)}
// //                           className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded"
// //                         >
// //                           Assign Staff
// //                         </button>
// //                         <button
// //                           onClick={() => handleDelete(appt.id)}
// //                           className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
// //                         >
// //                           Delete
// //                         </button>
// //                       </>
// //                     )}
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         )}

// //         {showAssignmentModal && selectedAppointment && (
// //           <StaffAssignment
// //             appointment={selectedAppointment}
// //             onClose={() => setShowAssignmentModal(false)}
// //             onAssign={handleAssignmentComplete}
// //           />
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminAppointmentsPage;

// import { useState, useEffect } from "react";
// import {
//   FiSearch,
//   FiFilter,
//   FiChevronDown,
//   FiChevronRight,
//   FiEdit2,
//   FiMessageCircle,
//   FiMessageSquare,
//   FiUserCheck,
//   FiUserPlus,
//   FiSave,
// } from "react-icons/fi";
// // import AdminAppointmentList from '../../components/Appointment/AdminAppointmentList';
// import StaffAssignment from "../../components/Stylist/StaffAssignment";
// import MessageModal from "../../components/Message/MessageModal";
// import Swal from "sweetalert2";
// // import InvoiceForm from "./InvoiceForm";
// // https://nvsalonbackend.dockyardsoftware.com/api
// // https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth
// const API_BASE_URL = "https://localhost:7014/api";
// const ADMIN_API_BASE_URL =
//   "https://localhost:7014/api/AdminAuth";
// const ALLOWED_STATUSES = ["Pending", "Scheduled", "Ongoing", "Cancelled"];

// const AdminAppointmentsPage = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [showAssignmentModal, setShowAssignmentModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editDate, setEditDate] = useState("");
//   const [editTime, setEditTime] = useState("");
//   const [editStatus, setEditStatus] = useState("");
//   const [staffList, setStaffList] = useState([]);
//   const [originalStatus, setOriginalStatus] = useState("");

//   // --- NEW: Custom service UI state ---
//   const [expandedRows, setExpandedRows] = useState(() => new Set());
//   const [serviceEditOpenForId, setServiceEditOpenForId] = useState(null);
//   const [activeServices, setActiveServices] = useState([]);
//   const [pickedServiceIds, setPickedServiceIds] = useState([]);
//   const [serviceEditLoading, setServiceEditLoading] = useState(false);
//   const [showMessageModal, setShowMessageModal] = useState(false);

//   // const [addingForId, setAddingForId] = useState(null); // which apptId is in "Add Now" picker
//   // const [selectedServiceIds, setSelectedServiceIds] = useState(() => new Set());
//   // const [customSubs, setCustomSubs] = useState(() => ({})); // { [apptId]: { items:[{id,name,price}], total:number } }

//   //New -- Invoice Modal Service UI state ---

//   // const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   // const [invoiceAppt, setInvoiceAppt] = useState(null);

//   // helper to open/close invoice
//   // const openInvoice = (appt) => {
//   //   setInvoiceAppt(appt); // pass the full appointment object
//   //   setShowInvoiceModal(true);
//   // };
//   // const closeInvoice = () => {
//   //   setShowInvoiceModal(false);
//   //   setInvoiceAppt(null);
//   // };
//   // Helper to get staff name by Id from local staffList state

//   const isCustom = (appt) => !!appt.isCustom;

//   const getStaffNameById = (id) => {
//     const staff = staffList.find((s) => s.Id === id);
//     return staff ? staff.Name : "Unassigned";
//   };

//   const fetchActiveServices = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("Authentication token missing");

//     // adjust if your path differs
//     const res = await fetch(`${ADMIN_API_BASE_URL}/active-services`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok)
//       throw new Error(`Failed to load active services: ${await res.text()}`);

//     // normalize to simple {Id, Name, Price}
//     const data = await res.json();
//     const list = Array.isArray(data) ? data : data.services || data.data || [];
//     return list.map((s) => ({
//       Id: Number(s.Id ?? s.id),
//       Name: s.Name ?? s.name,
//       Price: Number(s.Price ?? s.price ?? 0),
//     }));
//   };

//   const openServiceEditor = async (appt) => {
//     if (!appt.isCustom) return;
//     setServiceEditOpenForId(appt.id);
//     setServiceEditLoading(true);
//     setPickedServiceIds([]); // start blank (simple)
//     try {
//       const list = await fetchActiveServices();
//       setActiveServices(list);
//       // make sure its sub-rows are open so you see changes
//       setExpandedRows((prev) => {
//         const next = new Set(prev);
//         next.add(appt.id);
//         return next;
//       });
//     } catch (e) {
//       console.log(e.message);
//     } finally {
//       setServiceEditLoading(false);
//     }
//   };

//   const cancelServiceEditor = () => {
//     setServiceEditOpenForId(null);
//     setPickedServiceIds([]);
//   };
//   const closeServiceEditorKeepPicks = () => {
//     setServiceEditOpenForId(null);
//   };

//   const togglePickService = (id) => {
//     const nid = Number(id);
//     setPickedServiceIds((prev) =>
//       prev.includes(nid) ? prev.filter((x) => x !== nid) : [...prev, nid]
//     );
//   };

//   // When you click "Add" in the small panel: replace sub-rows and total locally
//   const addPickedServicesToRow = (appt) => {
//     if (pickedServiceIds.length === 0) {
//       alert("Select at least one service.");
//       return;
//     }
//     const chosen = activeServices.filter((s) =>
//       pickedServiceIds.includes(s.Id)
//     );
//     const newItems = chosen.map((s) => ({
//       name: s.Name,
//       price: Number(s.Price || 0),
//     }));
//     const newTotal = newItems.reduce((sum, it) => sum + it.price, 0);

//     setAppointments((prev) =>
//       prev.map((a) =>
//         a.id === appt.id
//           ? {
//               ...a,
//               items: newItems,
//               price: newTotal,
//               isCustom: true,
//               service: `Custom (${newItems.length})`,
//             }
//           : a
//       )
//     );

//     closeServiceEditorKeepPicks();
//   };

//   useEffect(() => {
//     const toYMDLocal = (v) => {
//       if (!v) return "N/A";
//       const d = new Date(v);
//       return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
//     };
//     const fetchStaff = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Authentication token missing");

//       const response = await fetch(`${API_BASE_URL}/AdminAuth/staffview`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error("Failed to fetch staff");

//       const data = await response.json();
//       // const staffs = data.staff || [];
//       setStaffList(data.staff || []);
//       // return staffs;
//     };

//     const fetchAppointments = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Authentication token missing");

//       const response = await fetch(`${API_BASE_URL}/Appointment/all`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok)
//         throw new Error(`Failed to fetch appointments: ${response.statusText}`);

//       const rows = await response.json();
//       const groups = new Map();
//       for (const r of rows) {
//         const key =
//           r.Id != null
//             ? String(r.Id)
//             : `${r.UserName ?? ""}|${r.AppointmentDate ?? ""}|${
//                 r.AppointmentTime ?? ""
//               }`;
//         let g = groups.get(key);
//         if (!g) {
//           g = {
//             // base fields
//             id: r.Id ?? key,
//             client: r.User?.Name || r.UserName || "N/A",
//             userName: r.UserName || "",
//             phone: r.UserPhone || r.Phone || "N/A",
//             date: r.AppointmentDate ? toYMDLocal(r.AppointmentDate) : "N/A",
//             time: r.AppointmentTime || "N/A",
//             status: r.Status || "Pending",
//             staffId: r.StaffId || null,
//             notes: r.AppointmentNotes,
//             // notes: r.AppointmentNotes || "Empty",
//             // details
//             items: [], // [{name, price}]
//           };
//           groups.set(key, g);
//         }
//         if (r.ServiceName) {
//           g.items.push({
//             name: r.ServiceName,
//             price: Number(r.ServicePrice || 0),
//           });
//         }
//       }

//       // Build final records, compute totals, mark custom/non-custom.
//       const mapped = Array.from(groups.values())
//         .map((g) => {
//           const isCustom = (g.items?.length || 0) > 1;
//           const total =
//             g.items?.reduce((sum, it) => sum + (Number(it.price) || 0), 0) || 0;

//           return {
//             ...g,
//             service: isCustom
//               ? `Custom(${g.items.length})`
//               : g.items?.[0]?.name || "N/A",
//             price: total,
//             isCustom,
//           };
//         })
//         // Hide Completed here
//         .filter((a) => ALLOWED_STATUSES.includes(String(a.status)));

//       setAppointments(mapped);
//     };

//     const load = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         await fetchStaff();
//         await fetchAppointments();
//       } catch (e) {
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const toggleExpand = (id) => {
//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(id) ? next.delete(id) : next.add(id);
//       return next;
//     });
//   };

//   // const toYMDLocal = (v) => {
//   //   if (!v) return "N/A";
//   //   const d = new Date(v);
//   //   // 'en-CA' gives YYYY-MM-DD reliably
//   //   return d.toLocaleDateString("en-CA");
//   // };

//   // const mappedAppointments = data.map((appt) => ({
//   //   id: appt.Id,
//   //   client: appt.User?.Name || appt.UserName || "N/A",
//   //   service: appt.ServiceName || "N/A",
//   //   phone: appt.Phone || "N/A",
//   //   // ? new Date(appt.AppointmentDate).toISOString().split('T')[0] : 'N/A'
//   //   date: appt.AppointmentDate ? toYMDLocal(appt.AppointmentDate) : "N/A",
//   //   time: appt.AppointmentTime || "N/A",
//   //   status: appt.Status || "Pending",
//   //   staffId: appt.StaffId || null,
//   //   assignedTo: appt.StaffId ? `Staff ID: ${appt.StaffId}` : "Unassigned",
//   //   userName: appt.User?.UserName || appt.UserName || "",
//   //   price: appt.Price || 0,
//   // }));

//   //   setAppointments(mappedAppointments);
//   // };

//   // NOTE: your dummy services list lives here; used by the "Add Now" picker.
//   // I kept your values and fixed a small comma.
//   // Duration is not used for math; price string is parsed when computing totals.
//   // Exclude "Custom" in the picker.
//   // You can replace this with an API later.
//   // prettier-ignore
//   // eslint-disable-next-line
//   // const services = [
//   //   { name: 'Haircut',   duration: '30 mins',   price: 'Rs.3,500',  id: 1 },
//   //   { name: 'Coloring',  duration: '2 hours',   price: 'Rs.1,200',  id: 2 },
//   //   { name: 'Styling',   duration: '45 mins',   price: 'Rs.5,000',  id: 3 },
//   //   { name: 'Manicure',  duration: '1 hour',    price: 'Rs.4,000',  id: 4 },
//   //   { name: 'Pedicure',  duration: '1 hour',    price: 'Rs.4,500',  id: 5 },
//   //   { name: 'Facial',    duration: '2.5 hours', price: 'Rs.15,500', id: 6 },
//   //   { name: 'Waxing',    duration: '3 hours',   price: 'Rs.10,800', id: 7 },
//   //   { name: 'Makeup',    duration: '1 hour',    price: 'Rs.8,000',  id: 8 },
//   //   { name: 'Custom',    duration: '1 hour',    price: 'Rs.8,000',  id: 9 }
//   // ];
//   // stash once so sub-components can read without prop-drilling
//   // window.__ELEGANCE_SERVICES__ = services;

//   //  const load = async () => {
//   //     setLoading(true);
//   //     setError(null);
//   //     try {
//   //       await fetchStaff();
//   //       await fetchAppointments();
//   //     } catch (e) {
//   //       setError(e.message);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   load();
//   // }, []);

//   // // --- NEW: helpers for "Custom" rows ---
//   // const isCustom = (appt) => (appt.service || "").toLowerCase() === "custom";

//   // const toggleExpand = (id) => {
//   //   setExpandedRows((prev) => {
//   //     const next = new Set(prev);
//   //     if (next.has(id)) next.delete(id);
//   //     else next.add(id);
//   //     return next;
//   //   });
//   // };

//   // const startAddNow = (apptId) => {
//   //   setAddingForId(apptId);
//   //   setSelectedServiceIds(new Set());
//   // };

//   // const cancelAddNow = () => {
//   //   setAddingForId(null);
//   //   setSelectedServiceIds(new Set());
//   // };

//   // const togglePickService = (srvId) => {
//   //   setSelectedServiceIds((prev) => {
//   //     const next = new Set(prev);
//   //     if (next.has(srvId)) next.delete(srvId);
//   //     else next.add(srvId);
//   //     return next;
//   //   });
//   // };

//   // const parseRsToNumber = (rsText) => {
//   //   // "Rs.15,500" -> 15500
//   //   if (!rsText) return 0;
//   //   const digits = rsText.replace(/[^\d]/g, "");
//   //   return Number(digits || 0);
//   // };

//   // const confirmAddNow = () => {
//   //   if (!addingForId) return;
//   //   const all = window.__ELEGANCE_SERVICES__ || [];
//   //   const picked = all
//   //     .filter((s) => s.name.toLowerCase() !== "custom")
//   //     .filter((s) => selectedServiceIds.has(s.id))
//   //     .map((s) => ({
//   //       id: s.id,
//   //       name: s.name,
//   //       price: parseRsToNumber(s.price),
//   //     }));

//   //   if (picked.length === 0) {
//   //     alert("Select at least one service.");
//   //     return;
//   //   }

//   //   const total = picked.reduce((sum, s) => sum + s.price, 0);

//   //   // Save under this appointment
//   //   setCustomSubs((prev) => ({
//   //     ...prev,
//   //     [addingForId]: { items: picked, total },
//   //   }));

//   //   // Reflect total into the appointment's price field
//   //   setAppointments((prev) =>
//   //     prev.map((appt) =>
//   //       appt.id === addingForId && isCustom(appt)
//   //         ? { ...appt, price: total }
//   //         : appt
//   //     )
//   //   );

//   //   // Keep the sub-table open for the appt
//   //   setExpandedRows((prev) => new Set([...prev, addingForId]));
//   //   cancelAddNow();
//   // };

//   // //End of the dummy data addition.

//   // const filteredAppointments = appointments.filter(
//   //   (appt) =>
//   //     (filter === "all" ||
//   //       appt.status.toLowerCase() === filter.toLowerCase()) &&
//   //     (appt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //       appt.service.toLowerCase().includes(searchTerm.toLowerCase()))
//   // );

//   const handleAssignStaff = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowAssignmentModal(true);
//   };

//   // Delete appointment
//   // const handleDelete = async (appointmentId) => {
//   //   const token = localStorage.getItem("token");
//   //   if (!token) return;
//   //   if (!window.confirm("Are you sure you want to delete this appointment?"))
//   //     return;

//   //   try {
//   //     const response = await fetch(
//   //       `${API_BASE_URL}/Appointment/${appointmentId}`,
//   //       {
//   //         method: "DELETE",
//   //         headers: { Authorization: `Bearer ${token}` },
//   //       }
//   //     );
//   //     if (!response.ok) throw new Error("Delete failed");

//   //     setAppointments((prev) =>
//   //       prev.filter((appt) => appt.id !== appointmentId)
//   //     );
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert("Failed to delete appointment");
//   //   }
//   // };

//   // Start editing date/time
//   const startEditing = (appt) => {
//     setEditingId(appt.id);
//     setEditDate(appt.date !== "N/A" ? appt.date : "");
//     setEditTime(appt.time !== "N/A" ? appt.time : "");
//     setEditStatus(appt.status);
//     setOriginalStatus(appt.status);
//   };

//   // Cancel editing
//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditDate("");
//     setEditTime("");
//     setEditStatus(originalStatus);
//     setServiceEditOpenForId(null);
//     setPickedServiceIds([]);
//   };

//   //Open Message for calling
//   const openMessage = (appt) => {
//     setSelectedAppointment(appt);
//     setShowMessageModal(true);
//   };

//   // Save updated date/time
//   // const saveDateTime = async () => {
//   //   const token = localStorage.getItem('token');
//   //   if (!token) return;
//   //   if (!editDate || !editTime) {
//   //     alert('Date and Time cannot be empty');
//   //     return;
//   //   }

//   //   try {
//   //     const response = await fetch(`${API_BASE_URL}/Appointment/${editingId}`, {
//   //       method: 'PUT',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         Authorization: `Bearer ${token}`
//   //       },
//   //       body: JSON.stringify({
//   //         AppointmentDate: editDate,
//   //         AppointmentTime: editTime,
//   //       }),
//   //     });

//   //     if (!response.ok) throw new Error('Failed to update appointment date/time');

//   //     setAppointments(prev =>
//   //       prev.map(appt =>
//   //         appt.id === editingId ? { ...appt, date: editDate, time: editTime } : appt
//   //       )
//   //     );
//   //     cancelEditing();
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert('Failed to update appointment date/time');
//   //   }
//   // };
//   // Save updated date/time

//   const normalizeDate = (d) => {
//     if (!d) return "";
//     const parts = d.includes("-") ? d.split("-") : d.split("/").reverse();
//     return parts.join("-");
//   };

//   const normalizeTime = (t) => {
//     if (!t) return "";
//     // Convert "3:00 PM" → "15:00:00"
//     const date = new Date(`1970-01-01T${t}`);
//     if (!isNaN(date)) return date.toTimeString().split(" ")[0].slice(0, 8);
//     // fallback if input already like "15:00"
//     return t.length === 5 ? `${t}:00` : t;
//   };
//   const saveDateTime = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) return;
//     if (!editDate || !editTime) {
//       await Swal.fire({
//         title: "Missing fields",
//         text: "Date and Time cannot be empty.",
//         icon: "warning",
//         background: "#1e1b4b",
//         color: "#ffffff",
//         confirmButtonColor: "#6366f1",
//         customClass: { popup: "rounded-xl border-2 border-indigo-500" },
//       });
//       return;
//     }

// //     console.log("Checking conflicts against:", {
// //   editDate,
// //   editTime,
// //   normalizedEditDate: normalizeDate(editDate),
// //   normalizedEditTime: normalizeTime(editTime),
// // });

//     const conflict = appointments.some((a) => {
//       // const apptDate = normalizeDate(a.date);
//       // const apptTime = normalizeTime(a.time);
//       const inputDate = normalizeDate(editDate);
//       const inputTime = normalizeTime(editTime);
//       return (
//         a.id !== editingId && a.date === inputDate && a.time === inputTime
//       );
//     });
    
//     if (conflict) {
//       await Swal.fire({
//         title: "Warning",
//         text: "There is already an appointment scheduled for this date and time.",
//         icon: "warning",
//         background: "#1e1b4b",
//         color: "#ffffff",
//         confirmButtonColor: "#6366f1",
//         customClass: { popup: "rounded-xl border-2 border-indigo-500" },
//       });
//       const original = appointments.find((a) => a.id === editingId);
//       setEditDate(original.date);
//       setEditTime(original.time);
//       return; // stop the save
//     }

//     // Ensure time is in "HH:mm:ss" format
//     const formattedTime = editTime.length === 5 ? `${editTime}:00` : editTime;

//     // find the appointment we are saving
//     const appt = appointments.find((a) => a.id === editingId);
//     const wantsCompleted = String(editStatus).toLowerCase() === "completed";
//     const hasStaff = !!appt?.staffId;
//     const isCustomNow = !!appt?.isCustom;

//     if (wantsCompleted && !hasStaff) {
//       await Swal.fire({
//         title: "Assign a staff member first",
//         text: "You can't mark this appointment as Completed without assigning staff.",
//         icon: "warning",
//         background: "#1e1b4b",
//         color: "#ffffff",
//         confirmButtonColor: "#6366f1",
//         customClass: { popup: "rounded-xl border-2 border-indigo-500" },
//       });
//       // revert the dropdown
//       setEditStatus(originalStatus);
//       return;
//     }

//     // 2) If completing (and staff exists), confirm
//     if (wantsCompleted) {
//       const { isConfirmed } = await Swal.fire({
//         title: "Mark as Completed?",
//         html: "<div class='text-gray-200'>This will be marked completed and removed from the list.</div>",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Yes, mark completed",
//         cancelButtonText: "Cancel",
//         background: "#1e1b4b",
//         color: "#ffffff",
//         confirmButtonColor: "#6366f1",
//         cancelButtonColor: "#6b7280",
//         customClass: { popup: "rounded-xl border-2 border-indigo-500" },
//       });

//       if (!isConfirmed) {
//         // user backed out → revert and stop
//         setEditStatus(originalStatus);
//         return;
//       }
//     }

//     try {
//       // 3) Persist to backend
//       const res = await fetch(`${API_BASE_URL}/Appointment/${editingId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           AppointmentDate: editDate,
//           AppointmentTime: formattedTime,
//           Status: editStatus,
//           IsCustom: isCustomNow,
//           ServiceTypeIds: isCustomNow ? pickedServiceIds : [],
//         }),
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(errorText || "Failed to update appointment");
//       }

//       // 4) Update UI
//       if (wantsCompleted) {
//         // remove from current list
//         setAppointments((prev) => prev.filter((a) => a.id !== editingId));
//       } else {
//         setAppointments((prev) =>
//           prev.map((a) =>
//             a.id === editingId
//               ? {
//                   ...a,
//                   date: editDate,
//                   time: formattedTime,
//                   status: editStatus,
//                 }
//               : a
//           )
//         );
//       }

//       // 5) Exit edit mode
//       setEditingId(null);
//       setServiceEditOpenForId(null);
//       setPickedServiceIds([]);
//     } catch (err) {
//       console.error("Failed to update appointment:", err);
//       await Swal.fire({
//         title: "Update failed",
//         text: String(err?.message || err),
//         icon: "error",
//         background: "#1e1b4b",
//         color: "#ffffff",
//         confirmButtonColor: "#6366f1",
//         customClass: { popup: "rounded-xl border-2 border-indigo-500" },
//       });
//       // revert on error
//       setEditStatus(originalStatus);
//     }

//     // if user opened the service editor on this same row but didn’t pick anything, block save
//     // if (
//     //   isCustomNow &&
//     //   serviceEditOpenForId === editingId &&
//     //   pickedServiceIds.length === 0
//     // ) {
//     //   alert("Please select sub-services and click Add before saving.");
//     //   return;
//     // }

//     // try {
//     //   const response = await fetch(`${API_BASE_URL}/Appointment/${editingId}`, {
//     //     method: "PUT",
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${token}`,
//     //     },
//     //     body: JSON.stringify({
//     //       AppointmentDate: editDate,
//     //       AppointmentTime: formattedTime,
//     //       Status: editStatus,
//     //       IsCustom: isCustomNow,
//     //       ServiceTypeIds: isCustomNow ? pickedServiceIds : [],
//     //     }),
//     //   });

//     //   if (!response.ok) {
//     //     const errorText = await response.text();
//     //     throw new Error(`Failed to update: ${errorText}`);
//     //   }

//     //   setAppointments((prev) =>
//     //     prev.map((appt) =>
//     //       appt.id === editingId
//     //         ? {
//     //             ...appt,
//     //             date: editDate,
//     //             time: formattedTime,
//     //             status: editStatus,
//     //           }
//     //         : appt
//     //     )
//     //   );
//     //   if (editStatus.toLowerCase() === "completed") {
//     //     setAppointments((prev) => prev.filter((a) => a.id !== editingId));
//     //   }
//     //   if (editStatus === "Completed" && !appt.staffId) {
//     //     await Swal.fire({
//     //       title: "Assign a staff member first",
//     //       text: "You can't mark this appointment as Completed without assigning staff.",
//     //       icon: "warning",
//     //       background: "#1e1b4b",
//     //       color: "#ffffff",
//     //       confirmButtonColor: "#6366f1",
//     //       customClass: {
//     //         popup: "rounded-xl border-2 border-indigo-500",
//     //       },
//     //     });
//     //     // e.target.value = editStatus; // snap back
//     //     return;
//     //   }
//     //   cancelEditing();
//     // } catch (err) {
//     //   console.error("Failed to update appointment " + err.message);
//     // }
//   };

//   // Update status
//   const updateStatus = async (
//     appointmentId,
//     userName,
//     newStatus,
//     prevStatus
//   ) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     // if (String(newStatus).toLowerCase() === "completed") {
//     //   const ok = window.confirm(
//     //     "Mark this appointment as Completed? It will be removed from this list."
//     //   );
//     //   if (!ok) {
//     //     // revert local select value
//     //     setEditStatus((prev) => prev); // no-op; UI select uses editStatus, so reset below
//     //     // Force the select to snap back by resetting editingId block
//     //     setAppointments((prev) =>
//     //       prev.map((a) =>
//     //         a.id === appointmentId ? { ...a, status: a.status } : a
//     //       )
//     //     );
//     //     return;
//     //   }
//     // }
//     if (String(newStatus).toLowerCase() === "completed") {
//       const { isConfirmed } = await Swal.fire({
//         title: "Mark as Completed?",
//         html: "<div class='text-gray-200'>This appointment will be marked completed and removed from this list.</div>",
//         icon: "question",
//         showCancelButton: true,
//         confirmButtonText: "Yes, mark completed",
//         cancelButtonText: "Cancel",
//         background: "#1e1b4b",
//         color: "#ffffff",
//         confirmButtonColor: "#6366f1",
//         cancelButtonColor: "#6b7280",
//         customClass: { popup: "rounded-xl border-2 border-indigo-500" },
//       });
//       if (!isConfirmed) {
//         if (appointmentId === editingId) setEditStatus(prevStatus);

//         return false;
//       }
//     }

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/AdminAuth/update-appointment-status`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             AppointmentId: appointmentId,
//             UserName: userName,
//             Status: newStatus,
//           }),
//         }
//       );

//       if (response.ok) {
//         console.log(response.data);
//       } else {
//         throw new Error("Failed to update status");
//       }

//       // setAppointments((prev) =>
//       //   prev.map((appt) =>
//       //     appt.id === appointmentId ? { ...appt, status: newStatus } : appt
//       //   )
//       if (String(newStatus).toLowerCase() === "completed") {
//         // remove from list
//         setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
//         if (appointmentId === editingId) cancelEditing();
//       } else {
//         setAppointments((prev) =>
//           prev.map((a) =>
//             a.id === appointmentId ? { ...a, status: newStatus } : a
//           )
//         );

//         if (appointmentId === editingId) setEditStatus(newStatus);
//       }
//       return true;
//     } catch (err) {
//       console.error(err);
//       Swal.fire({
//         title: "Failed to update status",
//         text: String(error?.message || error),
//         icon: "error",
//         background: "#1e1b4b",
//         color: "#ffffff",
//         confirmButtonColor: "#6366f1",
//         customClass: { popup: "rounded-xl border-2 border-indigo-500" },
//       });
//       if (appointmentId === editingId) setEditStatus(prevStatus);
//       return false;
//     }
//   };

//   const handleAssignmentComplete = async (appointmentId, staffId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Authentication token missing");

//       const parsedStaffId = parseInt(staffId);

//       const response = await fetch(`${API_BASE_URL}/AdminAuth/assign-staff`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           AppointmentId: appointmentId,
//           StaffId: parsedStaffId,
//         }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to assign staff: ${errorText}`);
//       }

//       await Swal.fire({
//         title: "Staff Assigned",
//         text: `${getStaffNameById(
//           parsedStaffId
//         )} has been assigned to this appointment.`,
//         icon: "success",
//         background: "#1e1b4b",
//         color: "#ffffff",
//         confirmButtonColor: "#6366f1",
//         customClass: { popup: "rounded-xl border-2 border-indigo-500" },
//       });

//       // Update appointment in state with new staff assignment and staffId
//       setAppointments((prev) =>
//         prev.map((appt) =>
//           appt.id === appointmentId
//             ? {
//                 ...appt,
//                 staffId: parsedStaffId,
//                 assignedTo: getStaffNameById(parsedStaffId),
//               }
//             : appt
//         )
//       );

//       setShowAssignmentModal(false); // Close modal after assignment
//     } catch (error) {
//       console.error("Error assigning staff:", error);
//       Swal.fire({
//         title: "Assignment Failed",
//         text: String(error?.message || error),
//         icon: "error",
//         background: "#1e1b4b",
//         color: "#ffffff",
//         confirmButtonColor: "#6366f1",
//         customClass: { popup: "rounded-xl border-2 border-indigo-500" },
//       });
//     }
//   };

//   const filteredAppointments = appointments.filter((appt) => {
//     const statusOk =
//       filter === "all"
//         ? true
//         : String(appt.status).toLowerCase() === filter.toLowerCase();
//     const searchOk =
//       appt.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       appt.service.toLowerCase().includes(searchTerm.toLowerCase());
//     return statusOk && searchOk;
//   });

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
//           Manage Appointments
//         </h2>
//         <p className="text-gray-400 text-sm mb-6">
//           Search, filter, assign, and update appointments.
//         </p>

//         {/* Controls */}
//         <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <FiSearch className="text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search appointments..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="bg-gray-800/80 border border-gray-700/80 rounded-lg px-3 py-2 w-full text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent pl-10"
//             />
//           </div>

//           <div className="md:col-span-2 flex items-center justify-start md:justify-end">
//             <div className="flex items-center gap-2">
//               <span className="inline-flex items-center gap-2 rounded-lg bg-gray-800/70 border border-gray-700/60 px-3 py-2 text-sm">
//                 <FiFilter className="text-gray-400" />
//                 <span className="text-gray-300 hidden sm:inline">Status</span>
//               </span>
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="bg-gray-800/80 border border-gray-700/80 rounded-lg px-3 py-2 w-full text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent"
//               >
//                 <option value="all">All</option>
//                 <option value="pending">Pending</option>
//                 <option value="scheduled">Scheduled</option>
//                 {/* <option value="completed">Completed</option> */}
//                 <option value="cancelled">Cancelled</option>
//                 <option value="ongoing">Ongoing</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Table Card */}
//         <div className="rounded-xl border border-gray-800 bg-gray-900/60 shadow-2xl shadow-black/30 backdrop-blur-sm">
//           {loading ? (
//             <p className="text-center text-gray-400 py-10">
//               Loading appointments...
//             </p>
//           ) : error ? (
//             <p className="text-center text-red-500 py-10">{error}</p>
//           ) : (
//             <div className="overflow-x-auto ">
//               <table className="min-w-[1000px] w-full">
//                 <thead className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-sm">
//                   <tr>
//                     {/* NEW: caret column */}
//                     <th className="px-2 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200 w-8"></th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
//                       Client
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
//                       Service
//                     </th>
//                     <th className="px-4 py-3 hidden text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
//                       Phone
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
//                       Date
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
//                       Time
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
//                       Status
//                     </th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
//                       Price
//                     </th>
//                     <th className="px-4 py-3 w-56 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
//                       Notes
//                     </th>
//                     <th className="px-4 py-3 text-justify text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
//                       Assigned To
//                     </th>

//                     <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-800">
//                   {filteredAppointments.map((appt) => {
//                     const expanded = expandedRows.has(appt.id);
//                     // const customData = customSubs[appt.id];

//                     // --- tweak: use custom total for display only (no logic changes) ---
//                     // const displayPrice =
//                     //   isCustom(appt) && customData?.total != null
//                     //     ? customData.total
//                     //     : appt.price;

//                     return (
//                       <>
//                         <tbody key={appt.id} className="contents">
//                           <tr
//                             // key={appt.id}
//                             className="bg-gray-900/30 hover:bg-gray-800/60 transition"
//                           >
                            
//                             {/* caret cell */}
//                             <td className="px-2 py-3 align-middle border-b border-gray-800">
//                               {appt.isCustom ? (
//                                 <button
//                                   type="button"
//                                   onClick={() => toggleExpand(appt.id)}
//                                   className="p-1 rounded hover:bg-gray-800"
//                                   title="Toggle details"
//                                 >
//                                   {expanded ? (
//                                     <FiChevronDown />
//                                   ) : (
//                                     <FiChevronRight />
//                                   )}
//                                 </button>
//                               ) : null}
//                             </td>

//                             <td className="px-2 py-2 text-sm align-middle border-b border-gray-800 whitespace-nowrap">
//                               <div className="font-medium">{appt.client}</div>
//                             </td>

//                             <td className="px-4 py-3 text-sm align-middle border-b border-gray-800">
//                               {/* {editingId === appt.id && isCustom(appt) ? (
//                                 <div className="flex items-center justify-between gap-3"> */}

//                               {appt.isCustom ? (
//                                 <div className="flex items-center gap-1">
//                                   <span className="line-clamp-1">
//                                     Custom ({appt.items?.length ?? 0.0})
//                                   </span>
//                                   {editingId === appt.id && (
//                                     <button
//                                       type="button"
//                                       onClick={() => openServiceEditor(appt)}
//                                       className="inline-flex items-center  rounded-md bg-gray-800/70 border border-gray-700/60 px-2 py-1 text-xs hover:bg-gray-800"
//                                       title="Edit sub-services"
//                                     >
//                                       <FiEdit2 className="shrink-0" />
//                                       Edit
//                                     </button>
//                                   )}
//                                 </div>
//                               ) : (
//                                 <span className="line-clamp-1">
//                                   <span className="line-clamp-1">
//                                     {appt.service}
//                                   </span>
//                                 </span>
//                               )}
//                             </td>

//                             <td className="px-4 text-sm py-3 align-middle border-b hidden border-gray-800 whitespace-nowrap">
//                               {appt.phone}
//                             </td>

//                             <td className="px-2 py-3 text-sm align-middle border-b border-gray-800">
//                               {editingId === appt.id ? (
//                                 <input
//                                   type="date"
//                                   value={editDate}
//                                   onChange={(e) => setEditDate(e.target.value)}
//                                   className="bg-gray-800/80 border border-gray-700/80 rounded-lg px-2 py-2 w-full  text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent"
//                                 />
//                               ) : (
//                                 <span className="whitespace-nowrap">
//                                   {appt.date}
//                                 </span>
//                               )}
//                             </td>

//                             <td className="px-4 py-3 text-sm align-middle border-b border-gray-800">
//                               {editingId === appt.id ? (
//                                 <input
//                                   type="time"
//                                   value={editTime}
//                                   onChange={(e) => setEditTime(e.target.value)}
//                                   className="bg-gray-800/80 border border-gray-700/80 rounded-lg px-1 py-2 w-full text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent"
//                                 />
//                               ) : (
//                                 <span className="whitespace-nowrap">
//                                   {appt.time}
//                                 </span>
//                               )}
//                             </td>

//                             <td className="px-6 py-2 text-xs align-middle border-b border-gray-800">
//                               {editingId === appt.id ? (
//                                 <select
//                                   value={editStatus}
//                                   onChange={
//                                     (e) => setEditStatus(e.target.value)

//                                     // const next = e.target.value;
//                                     // if (next === "Completed" && !appt.staffId) {
//                                     //   await Swal.fire({
//                                     //     title: "Assign a staff member first",
//                                     //     text: "You can't mark this appointment as Completed without assigning staff.",
//                                     //     icon: "warning",
//                                     //     background: "#1e1b4b",
//                                     //     color: "#ffffff",
//                                     //     confirmButtonColor: "#6366f1",
//                                     //     customClass: {
//                                     //       popup:
//                                     //         "rounded-xl border-2 border-indigo-500",
//                                     //     },
//                                     //   });
//                                     //   e.target.value = editStatus; // snap back
//                                     //   return;
//                                     // }

//                                     // setEditStatus(next); // local only
//                                     // const prev = editStatus; // store what’s currently shown

//                                     // const isUnassigned = !appt.staffId;
//                                     // if (next === "Completed" && isUnassigned) {
//                                     //   await Swal.fire({
//                                     //     title: "Assign a staff member first",
//                                     //     text: "You can't mark this appointment as Completed without assigning staff.",
//                                     //     icon: "warning",
//                                     //     background: "#1e1b4b",
//                                     //     color: "#ffffff",
//                                     //     confirmButtonColor: "#6366f1",
//                                     //     customClass: {
//                                     //       popup:
//                                     //         "rounded-xl border-2 border-indigo-500",
//                                     //     },
//                                     //   });
//                                     //   e.target.value = prev; // snap back
//                                     //   return; // stop here
//                                     // }

//                                     // const ok = await updateStatus(
//                                     //   appt.id,
//                                     //   appt.userName,
//                                     //   next,
//                                     //   prev
//                                     // );
//                                     // if (ok) setEditStatus(next);
//                                     // else e.target.value = prev;
//                                   }
//                                   className="bg-gray-800/80 border border-gray-700/80 rounded-lg  py-2 w-full text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent"
//                                 >
//                                   <option value="Pending">Pending</option>
//                                   <option value="Scheduled">Scheduled</option>
//                                   <option value="Completed">Completed</option>
//                                   <option value="Cancelled">Cancelled</option>
//                                   <option value="Ongoing">Ongoing</option>
//                                 </select>
//                               ) : (
//                                 <span className="inline-flex whitespace-nowrap items-center rounded-full px-3 py-0.5 text-xs font-medium bg-purple-500/10 text-purple-300 ring-1 ring-purple-500/30">
//                                   {appt.status}
//                                 </span>
//                               )}
//                             </td>

//                             <td className="px-4  text-sm py-3 align-middle border-b border-gray-800 whitespace-nowrap">
//                               {/* {appt.price.toLocaleString("en-LK", {
//                                 style: "currency",
//                                 currency: "LKR",
//                               })} */}
//                               {appt.price}
//                             </td>

//                             <td className="px-3 py-2 align-middle border-b border-gray-800 w-20">
//                               {appt.notes ? (
//                                 <div
//                                   className="text-xs overflow-hidden "
//                                   title={appt.notes} // show full note on hover
//                                 >
//                                   {appt.notes}
//                                 </div>
//                               ) : (
//                                 <span className="text-xs text-gray-400">
//                                   No notes
//                                 </span>
//                               )}
//                             </td>

//                             <td className="px-4 py-3 text-sm align-middle border-b border-gray-800 whitespace-nowrap">
//                               {appt.staffId ? (
//                                 <span className="inline-flex items-center gap-2">
//                                   <span className="h-2 w-2 rounded-full bg-emerald-400" />
//                                   {getStaffNameById(appt.staffId)}
//                                 </span>
//                               ) : (
//                                 <span className="text-gray-400">
//                                   Unassigned
//                                 </span>
//                               )}
//                             </td>

//                             <td className="px-4 txt-sm py-3 align-middle border-b border-gray-800">
//                               {editingId === appt.id ? (
//                                 <div className="flex flex-col flex-wrap gap-2 justify-center items-center">
//                                   <button
//                                     onClick={saveDateTime}
//                                     className="bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition"
//                                     title="Save"
//                                   >
//                                     Save
//                                   </button>
//                                   <button
//                                     onClick={cancelEditing}
//                                     className="bg-red-600 hover:bg-red-700 px-2 py-1.5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition"
//                                     title="Cancel"
//                                   >
//                                     Cancel
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <div className=" flex flex-row  gap-2  ">
//                                   <button
//                                     onClick={() => startEditing(appt)}
//                                     className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition"
//                                     title="Edit"
//                                   >
//                                     <FiEdit2 />
//                                   </button>

//                                   <button
//                                     onClick={() => handleAssignStaff(appt)}
//                                     className="bg-purple-600 hover:bg-purple-700 text-sm px-3 py-1.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition"
//                                     title="Add Staff"
//                                   >
//                                     <FiUserPlus />
//                                   </button>
//                                   {/* <button
//                                         onClick={() => handleDelete(appt.id)}
//                                         className=" bg-red-500 hover:bg-red-600 text-sm px-3 py-1.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition"
//                                         title="Delete"
//                                       >
//                                         Delete
//                                       </button> */}
//                                   <button
//                                     onClick={() => {
//                                       openMessage(appt);
//                                     }}
//                                     className="bg-green-600 hover:bg-green-700 text-sm px-3 py-1.5 rounded-lg font-medium focus:outline-none focus:ring-2"
//                                     title="Message"
//                                   >
//                                     <span>
//                                       <FiMessageCircle />
//                                     </span>
//                                     {/* <span>Message</span> */}
//                                   </button>
//                                 </div>
//                               )}
//                             </td>
//                           </tr>

//                           {/* NEW: Sub-row for Custom appointments */}
//                           {appt.isCustom && expanded && (
//                             <>
//                               {serviceEditOpenForId === appt.id && (
//                                 <tr className="bg-gray-900/60">
//                                   <td className="px-2 py-2"></td>
//                                   <td className="px-2 py-2"></td>
//                                   <td className="px-3 py-3" colSpan={7}>
//                                     {serviceEditLoading ? (
//                                       <div className="text-sm text-gray-400">
//                                         Loading services…
//                                       </div>
//                                     ) : (
//                                       <div className="rounded-lg border border-gray-800 bg-gray-900/70 p-3">
//                                         <div className="text-sm font-semibold mb-2">
//                                           Select Services
//                                         </div>
//                                         <div className="max-h-56 overflow-auto space-y-2 pr-1">
//                                           {activeServices.length === 0 ? (
//                                             <div className="text-sm text-gray-400">
//                                               No active services found.
//                                             </div>
//                                           ) : (
//                                             activeServices.map((s) => (
//                                               <label
//                                                 key={s.Id}
//                                                 className="flex items-center justify-between gap-3 rounded-md border border-gray-800 bg-gray-800/40 px-3 py-2"
//                                               >
//                                                 <div className="flex items-center gap-2">
//                                                   <input
//                                                     type="checkbox"
//                                                     checked={pickedServiceIds.includes(
//                                                       Number(s.Id)
//                                                     )}
//                                                     onChange={() =>
//                                                       togglePickService(
//                                                         Number(s.Id)
//                                                       )
//                                                     }
//                                                     className="h-4 w-4"
//                                                   />
//                                                   <span className="text-sm">
//                                                     {s.Name}
//                                                   </span>
//                                                 </div>
//                                                 <span className="text-sm tabular-nums">
//                                                   {Number(
//                                                     s.Price || 0
//                                                   ).toLocaleString("en-LK", {
//                                                     style: "currency",
//                                                     currency: "LKR",
//                                                   })}
//                                                 </span>
//                                               </label>
//                                             ))
//                                           )}
//                                         </div>
//                                         <div className="mt-3 flex gap-2">
//                                           <button
//                                             onClick={() =>
//                                               addPickedServicesToRow(appt)
//                                             }
//                                             className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1.5 rounded-lg font-medium"
//                                           >
//                                             Add
//                                           </button>
//                                           <button
//                                             onClick={cancelServiceEditor}
//                                             className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1.5 rounded-lg font-medium"
//                                           >
//                                             Cancel
//                                           </button>
//                                         </div>
//                                       </div>
//                                     )}
//                                   </td>
//                                   <td className="px-2 py-2"></td>
//                                 </tr>
//                               )}
//                               {/* Header row for sub-services (aligned under main columns) */}
//                               <tr className="bg-gray-900/60">
//                                 {/* caret, client */}
//                                 <td className="border-b border-gray-800 px-2 py-2"></td>
//                                 <td className="border-b border-gray-800 px-2 py-2"></td>

//                                 {/* 1) No (colspan 2) */}
//                                 <td
//                                   className="border-b border-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 text-left"
//                                   colSpan={2}
//                                 >
//                                   No
//                                 </td>

//                                 {/* 2) Service (colspan 3) */}
//                                 <td
//                                   className="border-b border-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 text-center"
//                                   colSpan={3}
//                                 >
//                                   Service
//                                 </td>

//                                 {/* 3) Amount (colspan 2) */}
//                                 <td
//                                   className="border-b border-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 text-center"
//                                   colSpan={2}
//                                 >
//                                   Amount (LKR)
//                                 </td>

//                                 {/* actions */}
//                                 <td className="border-b border-gray-800 px-2 py-2"></td>
//                               </tr>

//                               {appt.items && appt.items.length ? (
//                                 appt.items.map((it, idx) => (
//                                   <tr
//                                     key={`sub-${appt.id}-${it.id}`}
//                                     className="bg-gray-900/40 hover:bg-gray-800/50 transition"
//                                   >
//                                     {/* caret, client */}
//                                     <td className="border-b border-gray-800 px-2 py-2"></td>
//                                     <td className="border-b border-gray-800 px-2 py-2"></td>

//                                     {/* 1) No (colspan 2) */}
//                                     <td
//                                       className="border-b border-gray-800 px-3 py-2 text-sm text-left"
//                                       colSpan={2}
//                                     >
//                                       {idx + 1}
//                                     </td>

//                                     {/* 2) Service (colspan 3) */}
//                                     <td
//                                       className="border-b border-gray-800 px-3 py-2 text-sm text-center"
//                                       colSpan={3}
//                                     >
//                                       {it.name}
//                                     </td>

//                                     {/* 3) Amount (colspan 2) */}
//                                     <td
//                                       className="border-b border-gray-800 px-3 py-2 text-sm text-center tabular-nums"
//                                       colSpan={2}
//                                     >
//                                       {it.price.toLocaleString("en-LK")}
//                                     </td>

//                                     {/* actions */}
//                                     <td className="border-b border-gray-800 px-2 py-2"></td>
//                                   </tr>
//                                 ))
//                               ) : (
//                                 <tr className="bg-gray-900/40">
//                                   {/* caret, client */}
//                                   <td className="border-b border-gray-800 px-2 py-3"></td>
//                                   <td className="border-b border-gray-800 px-2 py-3"></td>

//                                   {/* empty message spanning the 7 content cols */}
//                                   <td
//                                     className="border-b border-gray-800 px-3 py-3 text-sm text-center text-gray-400"
//                                     colSpan={7}
//                                   >
//                                     No Services
//                                   </td>

//                                   {/* actions */}
//                                   <td className="border-b border-gray-800 px-2 py-3"></td>
//                                 </tr>
//                               )}

//                               {/* Total row: label spans 5, amount spans 2 */}
//                               <tr className="bg-gray-900/60">
//                                 {/* caret, client */}
//                                 <td className="border-b border-gray-800 px-2 py-2"></td>
//                                 <td className="border-b border-gray-800 px-2 py-2"></td>

//                                 {/* 'Total' (colspan 5) */}
//                                 <td
//                                   className="border-b border-gray-800 px-3 py-2 font-semibold text-left"
//                                   colSpan={5}
//                                 >
//                                   Total
//                                 </td>

//                                 {/* amount (colspan 2) */}
//                                 <td
//                                   className="border-b border-gray-800 px-3 py-2 font-semibold text-center tabular-nums"
//                                   colSpan={2}
//                                 >
//                                   {Number(appt.price || 0).toLocaleString(
//                                     "en-LK",
//                                     {
//                                       style: "currency",
//                                       currency: "LKR",
//                                     }
//                                   )}
//                                 </td>

//                                 {/* actions */}
//                                 <td className="border-b border-gray-800 px-2 py-2"></td>
//                               </tr>
//                             </>
//                           )}
//                         </tbody>
//                       </>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         {showAssignmentModal && selectedAppointment && (
//           <StaffAssignment
//             appointment={selectedAppointment}
//             onClose={() => setShowAssignmentModal(false)}
//             onAssign={handleAssignmentComplete}
//           />
//         )}

//         {showMessageModal && selectedAppointment && (
//           <MessageModal
//             appointment={selectedAppointment}
//             onClose={() => setShowMessageModal(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminAppointmentsPage;
