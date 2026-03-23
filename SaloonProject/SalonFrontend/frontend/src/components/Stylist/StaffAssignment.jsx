import { useState, useEffect } from 'react';
import { FiUser, FiX } from 'react-icons/fi';

const formatTimeTo12h = (t) => {
  if (!t) return "";

  // Expecting "HH:mm:ss" or "HH:mm"
  const [hh = "00", mm = "00"] = String(t).split(":");
  let h = parseInt(hh, 10);

  if (isNaN(h)) return t; // fallback if weird input

  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12; // 0 → 12, 13 → 1 etc.

  return `${h}:${mm} ${suffix}`;
};

const StaffAssignment = ({ appointment, onClose, onAssign }) => {
  const [selectedStaff, setSelectedStaff] = useState('');
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth/staffview', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch staff list');

        const data = await response.json();

        const allowedRoles = ['stylist','barber','senior stylist'];
        const filteredStaff = (data.staff || []).filter(staff => allowedRoles.includes(staff.Role.toLowerCase()));
        setStaffMembers(filteredStaff);
      } catch (error) {
        console.error('Error fetching staff:', error);
        alert('Failed to load staff list');
      }
    };

    fetchStaff();
  }, []);

  const handleAssign = async () => {
    if (!selectedStaff) return;

    setLoading(true);

    try {
      await onAssign(appointment.id, parseInt(selectedStaff));
      onClose(); // close modal after success
    } catch (error) {
      alert('Failed to assign staff.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-sm md:text-lg font-semibold text-white">Assign Staff to Appointment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 text-sm text-gray-300">
            <p className="mb-1">Client: <span className="font-medium">{appointment.client}</span></p>
            <p className="mb-1">Service: <span className="font-medium">{appointment.service}</span></p>
            <p>Date/Time: <span className="font-medium">{appointment.date} at {formatTimeTo12h(appointment.time)}</span></p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-400 mb-2 text-sm md:text-lg">Select Staff Member</label>
            <div className="relative">
              <select
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                className="bg-gray-700 border md:text-lg text-sm border-gray-600 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-purple-500 appearance-none"
              >
                <option value="">Select a staff member</option>
                {staffMembers.map((staff) => (
                  <option key={staff.Id} value={staff.Id}>
                    {staff.Name} ( Id: {staff.Id} )
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border md:text-lg text-sm border-gray-600 rounded-lg hover:bg-gray-700 transition text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedStaff || loading}
              className={`px-4 py-2 rounded-lg transition md:text-lg text-sm text-white ${
                selectedStaff && !loading
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-700 cursor-not-allowed'
              }`}
            >
              {loading ? 'Assigning...' : 'Assign Staff'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAssignment;
