import { FiX, FiSend, FiCheckCircle } from "react-icons/fi";

const InvoiceForm = (props) => {
  const appt = props.appointments;
  const onClose = props.onClose || (() => {});
  const onSent = props.onSent || (() => {}); // parent will POST this payload

  if (!appt) return null;

  const to12Hour = (timeStr) => {
    if (!timeStr) return "";

    // Handles both "HH:mm" and "HH:mm:ss"
    const [h, m] = timeStr.split(":");
    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12; // convert 0 → 12, 13 → 1, etc.

    return `${hour}:${m} ${ampm}`;
  };

  // Prepare receipt-friendly fields
  const serviceLines =
    Array.isArray(appt.items) && appt.isCustom
      ? appt.items.map((x) => ({ name: x.name, price: x.price }))
      : String(appt.service || "N/A")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

  // Prefer custom total if available
  const totalForInvoice =
    appt.isCustom && typeof appt.totalPrice === "number"
      ? appt.totalPrice
      : Number(appt.price || 0);

  const priceText = Number(totalForInvoice || 0).toLocaleString("en-LK", {
    style: "currency",
    currency: "LKR",
  });

  //   const formatAppointmentDate = (dateString) => {
  //   // if dateString = "2025-10-15"
  //   if (!dateString) return null;
  //   return `${dateString}T00:00:00`; // midnight DateTime
  // };

  // const formatAppointmentTime = (timeString) => {
  //   if (!timeString) return "00:00:00";

  //   // if "9:00" → pad hour; if "09:00" stays same
  //   const [h, m] = timeString.split(":");
  //   const hour = h.padStart(2, "0");
  //   const minute = m?.padStart(2, "0") || "00";
  //   return `${hour}:${minute}:00`;
  // };

  const handleSend = () => {
    const payload = {
      pId: appt.id,
      pDate: appt.date,
      pTime: appt.time,
      pStatus: appt.status,
      pName: appt.client,
      pPhone: appt.phone,
    };
    // console.log("[InvoiceForm] sending payload →", payload);
    onSent(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-gray-950 border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="relative p-5 text-center border-b border-white/10">
          <h3 className="text-lg font-semibold tracking-wide">
            Elegance Salon — Invoice
          </h3>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-gray-200 transition"
            title="Close"
          >
            <FiX size={18} />
          </button>
          <p className="text-[11px] text-gray-400 mt-1">
            Receipt for a completed appointment
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-5 text-sm text-gray-200 ">
          <div className="bg-black/30 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <FiCheckCircle size={14} /> {String(appt.status || "N/A")}
              </span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Client</span>
              <span className="font-semibold">{appt.client || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Phone</span>
              <span className="font-semibold">{appt.phone || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Appointment Date</span>
              <span className="font-semibold">{appt.date || "N/A"}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Appointment Time</span>
              <span className="font-semibold">{to12Hour(appt.time)}</span>
            </div>

            <div className="border-t border-gray-800 my-3" />

            <div className="mb-2">
              <span className="text-gray-400 block mb-1">Services</span>
              <div className="bg-gray-900/60 rounded-md p-3 border border-gray-800">
                {serviceLines.length ? (
                  <ul className="list-disc list-inside space-y-1">
                    {serviceLines.map((s, i) => (
                      <li
                        key={i}
                        className="text-gray-100 flex items-center text-xs justify-between"
                      >
                        {/*Setting the appointment service based on its service type*/}
                        <span className="text-gray-400">
                          {typeof s === "string" ? s : s.name}
                        </span>
                        <span className="text-gray-400">
                          {typeof s === "object"
                            ? Number(s.price).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </div>
            </div>

            <div className="border-t border-gray-800 my-3" />

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total</span>
              <span className="text-lg font-extrabold tracking-wide">
                {priceText}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="text-sm font-medium px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_15px_rgba(139,92,246,0.4)] transition flex items-center gap-2"
          >
            <FiSend size={14} />
            Send Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
