// import { useState, useEffect } from 'react';
// import { FiUserPlus, FiUser, FiMail, FiPhone, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

// const AdminStaffPage = () => {
//   const [showAddStaffModal, setShowAddStaffModal] = useState(false);
//   const [newStaff, setNewStaff] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     role: 'stylist'
//   });

//   const [staffMembers, setStaffMembers] = useState([]);
//   const [editingStaffId, setEditingStaffId] = useState(null);

//   // Fetch staff details from the backend
//   useEffect(() => {
//     fetch('https://saloonbackend.dockyardsoftware.com/api/AdminAuth/staffview')
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data.staff)) {
//           const formatted = data.staff.map(staff => ({
//             id: staff.Id,
//             name: staff.Name,
//             email: staff.Email,
//             phone: staff.Phone || 'N/A',
//             role: staff.Role || 'stylist'
//           }));
//           setStaffMembers(formatted);
//         } else {
//           console.error('Invalid staff response format:', data);
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching staff:', error);
//       });
//   }, []);

//   // const handleInputChange = (e) => {
//   //   const { name, value } = e.target;
//   //   setNewStaff(prev => ({ ...prev, [name]: value }));
//   // };
//   const handleInputChange = (e) => {
//   const { name, value, files, type } = e.target;
//   if (type === 'file') {
//     setNewStaff(prev => ({ ...prev, [name]: files[0] }));
//   } else {
//     setNewStaff(prev => ({ ...prev, [name]: value }));
//   }
// };

//  const fileToBase64 = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result.split(',')[1]); // get base64 string without prefix
//     reader.onerror = error => reject(error);
//   });
// };

// const handleAddStaff = async (e) => {
//   e.preventDefault();
//   if (newStaff.name && newStaff.email) {
//     try {
//       const formData = new FormData();
//       formData.append('Name', newStaff.name);
//       formData.append('Email', newStaff.email);
//       formData.append('Phone', newStaff.phone);
//       formData.append('Role', newStaff.role);
//       formData.append('Description', newStaff.description);

//       if (newStaff.image) {
//         formData.append('Image', newStaff.image);

//         // Convert image to base64 string and add as ImageData field
//         const base64String = await fileToBase64(newStaff.image);
//         formData.append('ImageData', base64String);
//       } else {
//         formData.append('ImageData', '');
//       }

//       const response = await fetch('https://saloonbackend.dockyardsoftware.com/api/AdminAuth/staff', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Failed to add staff:', errorText);
//         alert(errorText || 'Failed to add staff member.');
//         return;
//       }

//       const contentType = response.headers.get('content-type') || '';

//       let savedStaff;

//       if (contentType.includes('application/json')) {
//         savedStaff = await response.json();
//       } else {
//         const text = await response.text();
//         alert(text);
//         return;
//       }

//       setStaffMembers(prev => [
//         ...prev,
//         {
//           id: savedStaff.id || Date.now(),
//           name: savedStaff.name,
//           email: savedStaff.email,
//           phone: savedStaff.phone || 'N/A',
//           role: savedStaff.role || 'stylist',
//           description: savedStaff.description || '',
//           imageUrl: savedStaff.imageUrl || '',
//         }
//       ]);

//       setNewStaff({ name: '', email: '', phone: '', role: 'stylist', description: '', image: null });
//       setShowAddStaffModal(false);
//     } catch (error) {
//       console.error('Error adding staff:', error);
//       alert('An error occurred while adding staff.');
//     }
//   }
// };

//   const handleDeleteStaff = async (id) => {
//   try {
//     const response = await fetch(`https://saloonbackend.dockyardsoftware.com/api/AdminAuth/staff/${id}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Failed to delete staff:', errorText);
//       alert('Failed to delete staff member.');
//       return;
//     }

//     // Update local state after successful deletion
//     setStaffMembers(prev => prev.filter(staff => staff.id !== id));
//   } catch (error) {
//     console.error('Error deleting staff:', error);
//     alert('An error occurred while deleting staff.');
//   }
// };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-bold">Staff Management</h2>
//           <button
//             onClick={() => setShowAddStaffModal(true)}
//             className="flex items-center bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
//           >
//             <FiUserPlus className="mr-2" />
//             Add Staff
//           </button>
//         </div>

//         <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-700">
//               <thead className="bg-gray-750">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contact</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-700">
//                 {staffMembers.map((staff) => (
//                   <tr key={staff.id} className="hover:bg-gray-750 transition">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FiUser className="flex-shrink-0 mr-2 text-gray-400" />
//                         {staff.name}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FiMail className="flex-shrink-0 mr-2 text-gray-400" />
//                         {staff.email}
//                       </div>
//                       <div className="flex items-center mt-1">
//                         <FiPhone className="flex-shrink-0 mr-2 text-gray-400" />
//                         {staff.phone}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${
//                         staff.role === 'senior stylist' ? 'bg-purple-900 text-purple-200' :
//                         staff.role === 'stylist' ? 'bg-blue-900 text-blue-200' :
//                         staff.role === 'barber' ? 'bg-yellow-900 text-yellow-200' :
//                         staff.role === 'manager' ? 'bg-green-900 text-green-200' :
//                         'bg-gray-700 text-gray-300'
//                       }`}>
//                         {staff.role}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex space-x-2">
//                         <button className="text-gray-400 hover:text-blue-400 p-1">
//                           <FiEdit2 />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteStaff(staff.id)}
//                           className="text-gray-400 hover:text-red-400 p-1"
//                         >
//                           <FiTrash2 />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Add Staff Modal */}
//         {showAddStaffModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
//             <div className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-700">
//               <div className="flex justify-between items-center p-4 border-b border-gray-700">
//                 <h3 className="text-lg font-semibold">Add New Staff Member</h3>
//                 <button
//                   onClick={() => setShowAddStaffModal(false)}
//                   className="text-gray-400 hover:text-white"
//                 >
//                   <FiX size={20} />
//                 </button>
//               </div>

//               <form onSubmit={handleAddStaff} className="p-6 space-y-4">
//                 <div>
//                   <label className="block text-gray-400 mb-2">Full Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={newStaff.name}
//                     onChange={handleInputChange}
//                     className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-400 mb-2">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={newStaff.email}
//                     onChange={handleInputChange}
//                     className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-400 mb-2">Phone</label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={newStaff.phone}
//                     onChange={handleInputChange}
//                     className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full"
//                   />
//                 </div>
//                 {/* Description */}
//                 <div>
//                   <label className="block text-gray-400 mb-2">Description</label>
//                   <textarea
//                     name="description"
//                     value={newStaff.description}
//                     onChange={handleInputChange}
//                     className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full"
//                     rows={3}
//                   />
//                 </div>

//                 {/* Image upload */}
//                 <div>
//                   <label className="block text-gray-400 mb-2">Profile Image</label>
//                   <input
//                     type="file"
//                     name="image"
//                     accept="image/*"
//                     onChange={(e) => {
//                       const file = e.target.files[0];
//                       setNewStaff(prev => ({ ...prev, image: file }));
//                     }}
//                     className="text-gray-400"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-gray-400 mb-2">Role</label>
//                   <select
//                     name="role"
//                     value={newStaff.role}
//                     onChange={handleInputChange}
//                     className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full"
//                   >
//                     <option value="stylist">Stylist</option>
//                     <option value="senior stylist">Senior Stylist</option>
//                     <option value="barber">Barber</option>
//                     <option value="receptionist">Receptionist</option>
//                     <option value="manager">Manager</option>
//                   </select>
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowAddStaffModal(false)}
//                     className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
//                   >
//                     Add Staff
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminStaffPage;

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FiUserPlus,
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const AdminStaffPage = () => {
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    role: "stylist",
    description: "",
    image: null,
    imageUrl: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    image: "",
  });

  const [staffMembers, setStaffMembers] = useState([]);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch staff details from the backend
  const fetchStaff = async () => {
    try {
      const res = await fetch(
        "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/staffview"
      );
      const data = await res.json();

      if (Array.isArray(data.staff)) {
        const formatted = data.staff.map((staff) => ({
          id: staff.Id,
          name: staff.Name,
          email: staff.Email,
          phone: staff.Phone || "Not Available",
          role: staff.Role || "stylist",
          description: staff.Description || "",
          imageUrl:
            `https://nvsalonbackend.dockyardsoftware.com${staff.ImageUrl}` ||
            "",
        }));
        setStaffMembers(formatted);
      } else {
        console.error("Invalid staff response format:", data);
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  // ✅ Then call it inside useEffect like this:
  useEffect(() => {
    fetchStaff();
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: newStaff.name.trim() ? "" : "Name is required",
      email: validateEmail(newStaff.email),
      phone: validatePhone(newStaff.phone),
      description: validateDescription(newStaff.description),
      image: editingStaffId ? "" : newStaff.image ? "" : "Image is required",
    };
    setErrors(newErrors);
    const problems = Object.entries(newErrors)
      .filter(([, msg]) => msg)
      .map(([k, msg]) => `• ${k[0].toUpperCase() + k.slice(1)}: ${msg}`)
      .join("<br/>");

    if (problems) {
      Swal.fire({
        ...alertTheme,
        icon: "error",
        title: "Error",
        html: problems,
        confirmButtonText: "Got it",
      });
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone) return ""; // Phone is optional
    const re = /^\d+$/;
    if (!re.test(phone)) return "Phone must contain only numbers";
    if (phone.length < 10) return "Phone must be at least 10 digits";
    if (phone.length > 15) return "Phone must be at most 15 digits";
    return "";
  };

  const validateDescription = (description) => {
    if (!description) return "Description should not be empty";
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value, files, type } = e.target;

    // Special handling for phone number to only allow numbers
    if (name === "phone") {
      // Only allow numbers and limit to 15 characters
      const numbersOnly = value.replace(/[^0-9]/g, "");
      if (numbersOnly.length <= 15) {
        setNewStaff((prev) => ({ ...prev, [name]: numbersOnly }));
      }
      // Validate immediately
      setErrors((prev) => ({ ...prev, phone: validatePhone(numbersOnly) }));
      return;
    }

    if (type === "file") {
      const file = files[0] || null;
      setNewStaff((prev) => ({ ...prev, [name]: file }));
      setErrors((prev) => ({
        ...prev,
        image: file ? "" : "Profile image is required",
      }));
      return;
    } else {
      setNewStaff((prev) => ({ ...prev, [name]: value }));
      // Validate other fields on change if needed
      if (name === "email") {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
      } else if (name === "name") {
        setErrors((prev) => ({
          ...prev,
          name: value.trim() ? "" : "Name is required",
        }));
      }
    }
  };

  // const fileToBase64 = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result.split(",")[1]);
  //     reader.onerror = (error) => reject(error);
  //   });
  // };

  const alertTheme = {
    background: "#1e1b4b",
    color: "#ffffff",
    confirmButtonColor: "#6366f1",
    customClass: { popup: "border-2 border-indigo-500 rounded-xl" },
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("Name", newStaff.name);
      formData.append("Email", newStaff.email);
      formData.append("Phone", newStaff.phone);
      formData.append("Role", newStaff.role);
      formData.append("Description", newStaff.description);

      if (newStaff.image) {
        formData.append("Image", newStaff.image);
        //   const base64String = await fileToBase64(newStaff.image);
        //   formData.append("ImageData", base64String);
        // } else {
        //   formData.append("ImageData", "");
      }
      // https://localhost:7014/api/AdminAuth/EditStaff/${editingStaffId
      // https://localhost:7014/api/AdminAuth/staff

      // `https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/EditStaff/${editingStaffId}`
      // "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/staff"

      const url = editingStaffId
        ? `https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/EditStaff/${editingStaffId}`
        : "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/staff";

      const method = editingStaffId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to save staff:", errorText);
        await Swal.fire({
          alertTheme,
          icon: "error",
          title: "Save failed",
          text: "Could not save staff member.",
        });
        return;
      }

      const contentType = response.headers.get("content-type") || "";
      let savedStaff;

      if (contentType.includes("application/json")) {
        savedStaff = await response.json();
      } else {
        await Swal.fire({
          ...alertTheme,
          icon: "success",
          title: editingStaffId ? "Staff updated" : "Staff added",
          timer: 1300,
          showConfirmButton: false,
        });
        setShowAddStaffModal(false);
        await fetchStaff();
        return;
      }

      setStaffMembers((prev) => {
        if (editingStaffId) {
          // Replace updated staff
          return prev.map((staff) =>
            staff.id === editingStaffId
              ? {
                  ...savedStaff,
                  id: editingStaffId, // Ensure we keep the same ID
                  phone: savedStaff.Phone || "N/A",
                  role: savedStaff.Role || "stylist",
                  description: savedStaff.Description || "",
                  imageUrl: savedStaff.ImageUrl || "",
                }
              : staff
          );
        } else {
          // Add new staff
          return [
            ...prev,
            {
              id: savedStaff.Id || Date.now(),
              name: savedStaff.Name,
              email: savedStaff.Email,
              phone: savedStaff.Phone || "N/A",
              role: savedStaff.Role || "stylist",
              description: savedStaff.Description || "",
              imageUrl: savedStaff.ImageUrl || "",
            },
          ];
        }
      });

      setNewStaff({
        name: "",
        email: "",
        phone: "",
        role: "stylist",
        description: "",
        image: null,
      });
      setEditingStaffId(null);
      setShowAddStaffModal(false);
    } catch (error) {
      console.error("Error saving staff:", error);
      await Swal.fire({
        ...alertTheme,
        icon: "error",
        title: "Unexpected error",
        text: "An error occurred while saving staff.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    const result = await Swal.fire({
      ...alertTheme,
      icon: "warning",
      title: "Delete this staff member?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    });
    if (!result.isConfirmed) return;
    // https://localhost:7014/api/AdminAuth/staff/${id}
    // https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/staff/${id}
    try {
      const response = await fetch(
        `https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/staff/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to delete staff:", errorText);
        await Swal.fire({
          ...alertTheme,
          icon: "error",
          title: "Delete failed" || "Could not delete staff.",
        });
        return;
      }

      await Swal.fire({
        ...alertTheme,
        icon: "success",
        title: "Deleted",
        timer: 900,
        showConfirmButton: false,
      });
      await fetchStaff();
      // setStaffMembers((prev) => prev.filter((staff) => staff.id !== id));
    } catch (error) {
      console.error("Error deleting staff:", error);
      await Swal.fire({
        ...alertTheme,
        icon: "error",
        title: "Unexpected error",
        text: "An error occurred while deleting.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="sm:text-2xl text-lg font-bold">Staff Management</h2>
          <button
            onClick={() => {
              setEditingStaffId(null);
              setNewStaff({
                name: "",
                email: "",
                phone: "",
                role: "stylist",
                description: "",
                image: null,
              });
              setShowAddStaffModal(true);
            }}
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-sm  px-4 py-2 rounded-lg transition"
          >
            <FiUserPlus className="mr-2" />
            Add Staff
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {staffMembers.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-750 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {staff.imageUrl ? (
                          <img
                            src={staff.imageUrl}
                            alt={staff.name}
                            className="h-8 w-8 rounded-full mr-2 object-cover"
                          />
                        ) : (
                          <FiUser className="flex-shrink-0 mr-2 text-gray-400" />
                        )}
                        {staff.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiMail className="flex-shrink-0 mr-2 text-gray-400" />
                        {staff.email}
                      </div>
                      <div className="flex items-center mt-1">
                        <FiPhone className="flex-shrink-0 mr-2 text-gray-400" />
                        {staff.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          staff.role === "senior stylist"
                            ? "bg-purple-900 text-purple-200"
                            : staff.role === "stylist"
                            ? "bg-blue-900 text-blue-200"
                            : staff.role === "barber"
                            ? "bg-yellow-900 text-yellow-200"
                            : staff.role === "manager"
                            ? "bg-green-900 text-green-200"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="text-gray-400 hover:text-blue-400 p-1"
                          onClick={() => {
                            setEditingStaffId(staff.id);
                            setNewStaff({
                              name: staff.name,
                              email: staff.email,
                              phone: staff.phone,
                              role: staff.role,
                              description: staff.description,
                              image: null,
                              imageUrl: staff.imageUrl || "",
                            });

                            setShowAddStaffModal(true);
                          }}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staff.id)}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Staff Modal */}
        {showAddStaffModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-md border border-gray-700 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-800 flex justify-between items-center p-4 border-b border-gray-700 z-10">
                <h3 className="text-lg font-semibold">
                  {editingStaffId
                    ? "Edit Staff Member"
                    : "Add New Staff Member"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddStaffModal(false);
                    setEditingStaffId(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveStaff} className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newStaff.name}
                    onChange={handleInputChange}
                    className={`bg-gray-700 border ${
                      errors.name ? "border-red-500" : "border-gray-600"
                    } rounded-lg px-4 py-2 w-full`}
                    required
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={newStaff.email}
                    onChange={handleInputChange}
                    className={`bg-gray-700 border ${
                      errors.email ? "border-red-500" : "border-gray-600"
                    } rounded-lg px-4 py-2 w-full`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={newStaff.phone}
                    onChange={handleInputChange}
                    maxLength={15}
                    className={`bg-gray-700 border ${
                      errors.phone ? "border-red-500" : "border-gray-600"
                    } rounded-lg px-4 py-2 w-full`}
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newStaff.description}
                    onChange={handleInputChange}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">
                    Profile Image {editingStaffId ? "" : "*"}
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="text-gray-400"
                  />
                  {errors.image && !editingStaffId && (
                    <p className="text-red-400 text-sm mt-1">{errors.image}</p>
                  )}
                  {newStaff.imageUrl && !newStaff.image && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">Current Image:</p>
                      <img
                        src={newStaff.imageUrl}
                        alt="Current staff"
                        className="h-20 w-20 object-cover rounded-full mt-1"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Role</label>
                  <select
                    name="role"
                    value={newStaff.role}
                    onChange={handleInputChange}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full"
                  >
                    <option value="stylist">Stylist</option>
                    <option value="senior stylist">Senior Stylist</option>
                    <option value="barber">Barber</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddStaffModal(false);
                      setEditingStaffId(null);
                    }}
                    className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`px-4 py-2 rounded-lg transition ${
                      isSaving
                        ? "bg-purple-600/60 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {isSaving
                      ? "Saving..."
                      : editingStaffId
                      ? "Save Changes"
                      : "Add Staff"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStaffPage;
