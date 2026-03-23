import { FaStickyNote } from "react-icons/fa";
import { FiCalendar, FiClock, FiScissors, FiUser } from "react-icons/fi";

const AppointmentList = ({ appointments }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-6">Your Appointments</h3>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          You don't have any upcoming appointments.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 text-xs sm:text-sm">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="relative bg-gray-800 rounded-lg border border-gray-700 shadow p-5 pt-7" // inner padding a bit larger, especially top
            >
              {/* Floating ID badge (top-left) */}
              <span
                className="absolute -top-2 -left-2 z-10
                           rounded-md px-2 py-1 text-[13px] font-semibold tracking-wide
                           bg-purple-600/20 text-purple-300 border border-purple-400/50
                           shadow-md backdrop-blur-sm select-none"
                title="Appointment ID"
              >
                NO - {appointment.id}
              </span>

              <div className="flex justify-between items-start mb-3 ">
                <h4 className="text-sm font-medium flex items-center flex-wrap gap-1 md:text-lg ">
                  <FiScissors className="text-purple-400 mr-2" />
                  Services: {appointment.service}
                </h4>

                <span className="bg-gray-600  text-xs px-2 py-1 rounded-lg md:text-sm">
                  {appointment.status || "Confirmed"}
                </span>
              </div>

              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <FiUser className="mr-2 text-gray-400" />
                  Stylist: {appointment.stylist}
                </div>
                <div className="flex items-center">
                  <FiCalendar className="mr-2 text-gray-400" />
                  Date:{" "}
                  {(() => {
                    const d = new Date(appointment.date);
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, "0");
                    const day = String(d.getDate()).padStart(2, "0");
                    return `${year}-${month}-${day}`;
                  })()}
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-2 text-gray-400" />
                  Time: {appointment.time}
                </div>
              </div>

              {appointment.notes && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-start gap-2">
                    <FaStickyNote className="mt-0.5 text-gray-400" />
                    <div>
                      <span className="text-gray-300">Notes:</span>
                      <p className="text-sm text-gray-400 italic">
                        {appointment.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
