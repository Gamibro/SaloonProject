import { FiUser, FiCalendar, FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';

const AdminAppointmentList = ({ appointments, onAssignStaff }) => {
  const getStatusColor = (status) => {
    switch(status) {
      
      case 'pending': return 'bg-yellow-900 text-yellow-200';
      case 'completed': return 'bg-green-900 text-green-200';
      case 'cancelled': return 'bg-red-900 text-red-200';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-750">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Service</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  No appointments found
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-750 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiUser className="flex-shrink-0 mr-2 text-gray-400" />
                      {appointment.client}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{appointment.service}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">{appointment.phone}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FiCalendar className="flex-shrink-0 mr-2 text-gray-400" />
                      {new Date(appointment.date).toLocaleDateString()}
                      <FiClock className="flex-shrink-0 ml-3 mr-2 text-gray-400" />
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.assignedTo || (
                      <button 
                        onClick={() => onAssignStaff(appointment)}
                        className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                      >
                        Assign Staff
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-blue-400 p-1">
                        <FiEdit2 />
                      </button>
                      <button className="text-gray-400 hover:text-red-400 p-1">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointmentList;