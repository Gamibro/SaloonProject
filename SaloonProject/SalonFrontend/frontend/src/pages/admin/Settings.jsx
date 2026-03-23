import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const AdminSettings = () => {
  const [salonSettings, setSalonSettings] = useState({
    SalonName: "",
    OpeningTime: "",
    ClosingTime: "",
    BookingPolicy: "",
  });

const toTimeSpan = (timeStr) => {
  if (!timeStr) return null; // or "" depending on what your API expects
  const [hh, mm] = timeStr.split(":");
  const h = hh.padStart(2, "0");
  const m = mm.padStart(2, "0");
  // -> "09:00:00.0000000"
  return `${h}:${m}:00.0000000`;
};
  // Fetch existing settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      // https://localhost:7014/api/AdminAuth/GetSalonSettings
      // "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/GetSalonSettings"
      try {
        const response = await axios.get("https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/GetSalonSettings");
        setSalonSettings(response.data);
      } catch (error) {
        console.error("Failed to fetch salon settings", error);
      }
    };
    fetchSettings();
  }, []);
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalonSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Save updated settings
  const handleSave = async () => {
    // "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/SaveSalonSettings"
    // https://localhost:7014/api/AdminAuth/SaveSalonSettings
    try {
    
    const payload = {
      ...salonSettings,
      OpeningTime: toTimeSpan(salonSettings.OpeningTime),
      ClosingTime: toTimeSpan(salonSettings.ClosingTime),
    };
      await axios.post("https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/SaveSalonSettings", payload);
      await Swal.fire({
      title: "Settings Updated",
      text: "Salon settings were saved successfully.",
      icon: "success",
      background: "#1e1b4b",
      color: "#ffffff",
      confirmButtonColor: "#6366f1",
      customClass: { popup: "rounded-xl border-2 border-indigo-500 " },
      timer: 2000,
      showConfirmButton: false,
    });
    } catch (error) {
      console.error("Failed to save salon settings", error);
     await Swal.fire({
      title: "Update Failed",
      text: "Failed to update settings.",
      icon: "error",
      background: "#1e1b4b",
      color: "#ffffff",
      confirmButtonColor: "#6366f1",
      customClass: { popup: "rounded-xl border-2 border-indigo-500" },
    });
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Admin Settings</h2>
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-6">Salon Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2">Salon Name</label>
              <input
                type="text"
                name="SalonName"
                value={salonSettings.SalonName}
                onChange={handleChange}
                disabled
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Working Hours</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Opening Time</label>
                  <input
                    type="time"
                    name="OpeningTime"
                    disabled
                    value={salonSettings.OpeningTime}
                    onChange={handleChange}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">Closing Time</label>
                  <input
                    type="time"
                    disabled
                    name="ClosingTime"
                    value={salonSettings.ClosingTime}
                    onChange={handleChange}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Booking Policy</label>
              <textarea
                name="BookingPolicy"
                value={salonSettings.BookingPolicy}
                onChange={handleChange}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full h-32 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="pt-4">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminSettings;





// const AdminSettings = () => {
//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h2 className="text-2xl font-bold mb-8">Admin Settings</h2>
        
//         <div className="bg-gray-800 rounded-xl p-6">
//           <h3 className="text-xl font-semibold mb-6">Salon Settings</h3>
          
//           <div className="space-y-6">
//             <div>
//               <label className="block text-gray-400 mb-2">Salon Name</label>
//               <input
//                 type="text"
//                 defaultValue="Elegance Salon"
//                 className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
//               />
//             </div>
            
//             <div>
//               <label className="block text-gray-400 mb-2">Working Hours</label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-gray-500 text-sm mb-1">Opening Time</label>
//                   <input
//                     type="time"
//                     defaultValue="09:00"
//                     className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-gray-500 text-sm mb-1">Closing Time</label>
//                   <input
//                     type="time"
//                     defaultValue="20:00"
//                     className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-purple-500"
//                   />
//                 </div>
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-gray-400 mb-2">Booking Policy</label>
//               <textarea
//                 defaultValue="Please arrive 10 minutes before your appointment. Cancellations must be made at least 24 hours in advance."
//                 className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full h-32 focus:outline-none focus:ring-1 focus:ring-purple-500"
//               />
//             </div>
            
//             <div className="pt-4">
//               <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition">
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSettings;