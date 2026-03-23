// MessageModal.jsx
import { useEffect, useMemo, useState } from "react";
import { FiX } from "react-icons/fi";
import Swal from "sweetalert2";

const API_APPT = "https://nvsalonbackend.dockyardsoftware.com/api/Appointment";
const API_ADMIN = "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth";

const STATUSES = ["Pending", "Scheduled", "Ongoing", "Cancelled"];

const MessageModal = ({ appointment, onClose, onStatusUpdated }) => {
  const [message, setMessage] = useState("");
  const [nextStatus, setNextStatus] = useState(
    appointment?.status || "Pending"
  );
  const [lastAutoTemplate, setLastAutoTemplate] = useState("");

  // --- helpers ---
  const to12h = (t) => {
    if (!t) return "";
    const [hh = "00", mm = "00"] = String(t).split(":");
    let h = parseInt(hh, 10);
    const suffix = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${mm.padStart(2, "0")} ${suffix}`;
  };

  const formattedDateForApi = (d) => {
    const ymd = /^\d{4}-\d{2}-\d{2}$/.test(d)
      ? d
      : new Date(d).toLocaleDateString("en-CA");
    return `${ymd}T00:00:00.0000000`;
  };

  const formattedTimeForApi = (t) =>
    t && t.length === 5 ? `${t}:00` : t || "";

  const apptIdText = useMemo(
    () =>
      appointment?.id != null ? `NO-${appointment.id}` : "your appointment",
    [appointment?.id]
  );

  const defaultLine = (s) =>
    `Your appointment ${apptIdText} is ${String(s || "").toLowerCase()} on ${
      appointment?.date
    } at ${to12h(appointment?.time)}.`;

  // prefill
  useEffect(() => {
    const s = appointment?.status || "Pending";
    const t = defaultLine(s);
    setNextStatus(s);
    setMessage(t);
    setLastAutoTemplate(t);
  }, [appointment]); // eslint-disable-line react-hooks/exhaustive-deps

  // auto-update message if user hasn’t typed
  useEffect(() => {
    const t = defaultLine(nextStatus);
    if (message === lastAutoTemplate) {
      setMessage(t);
      setLastAutoTemplate(t);
    } else {
      setLastAutoTemplate(t);
    }
  }, [nextStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    if (!message.trim()) {
      Swal.fire({
        title: "Empty message",
        text: "Message cannot be empty.",
        icon: "warning",
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // 1) Send Message (success alert only for this)
      const smsRes = await fetch(`${API_APPT}/sendMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNo: appointment.phone,
          message,
          AppointmentDate: formattedDateForApi(appointment.date),
          AppointmentTime: formattedTimeForApi(appointment.time),
        }),
      });
      if (!smsRes.ok) throw new Error(await smsRes.text());

      // 2) Update Appointment Status (silent)
      if (nextStatus !== appointment.status && STATUSES.includes(nextStatus)) {
        await fetch(`${API_ADMIN}/update-appointment-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            AppointmentId: appointment.id,
            UserName: appointment.userName || "",
            Status: nextStatus,
          }),
        }).catch(() => {});
      }

      await Swal.fire({
        title: "Message Sent",
        html: `<div class='text-center text-gray-200'>Customer of Appointment ${apptIdText} has been notified.</div>`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });

      // notify parent to update row status immediately
      if (onStatusUpdated) onStatusUpdated(nextStatus);

      onClose();
    } catch (e) {
      Swal.fire({
        title: "Send Failed",
        text: String(e?.message || e),
        icon: "error",
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });
    }
  };

  if (!appointment) return null;

  const displayTime = to12h(appointment.time);

  // restore services chips
  const serviceText = appointment.isCustom
    ? (appointment.items || [])
        .map((it) => it.name)
        .filter(Boolean)
        .join(", ")
    : appointment.service;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start p-3 sm:p-4 overflow-y-auto"
      aria-modal="true"
      role="dialog"
    >
      {/* Soft patterned backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_50%_-10%,rgba(79,70,229,0.15),transparent_60%),radial-gradient(20rem_12rem_at_80%_110%,rgba(16,185,129,0.08),transparent_60%)]" />

      <div className="w-full max-w-md mt-8 mb-8 max-h-[90vh]">
        {/* Neon hairline frame */}
        <div className="rounded-2xl p-[1.25px] bg-gradient-to-br from-indigo-500/70 via-indigo-400/50 to-indigo-500/70 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
          {/* Card */}
          <div className="rounded-2xl bg-gray-800/95 border border-gray-700/70 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="relative px-5 py-4 border-b border-gray-700/70">
              <div className="absolute inset-x-5 -top-0.5 h-px bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-[1.05rem] font-semibold tracking-wide">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-indigo-100">
                    Message
                  </span>
                </h3>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="rounded-full p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/70 transition"
                >
                  <FiX size={18} />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Send a quick SMS update to the customer.
              </p>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-4 overflow-y-auto">
              {/* Recipient / meta */}
              <div className="rounded-xl bg-gray-900/40 border border-gray-700/70 p-3">
                <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs sm:text-[0.85rem]">
                  <div className="flex items-center gap-2">
                    <dt className="text-[11px] sm:text-xs text-gray-400">To</dt>
                    <dd className="text-xs sm:text-[0.85rem] text-gray-200 font-medium truncate">
                      {appointment.client}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-[11px] sm:text-xs text-gray-400">
                      Phone
                    </dt>
                    <dd className="text-xs sm:text-[0.85rem] text-gray-200 font-medium">
                      {appointment.phone}
                    </dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <dt className="text-gray-400">Date</dt>
                    <dd className="text-gray-200">
                      <span className="inline-flex items-center  rounded-full border border-indigo-500/40 bg-gray-800/70 px-2 py-0.5 text-[9px] sm:text-xs">
                        {appointment.date}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-gray-400">Time</dt>
                    <dd className="text-gray-200">
                      <span className="inline-flex items-center rounded-full border border-indigo-500/40 bg-gray-800/70 px-2 py-0.5 sm:text-xs text-[9px]">
                        {displayTime}
                      </span>
                    </dd>
                  </div>
                </dl>

                {/* dotted separator */}
                <div className="my-3 h-px border-t border-dotted border-gray-700/80" />

                {/* Services chips */}
                <div>
                  <div className="text-[11px] sm:text-xs uppercase tracking-wider text-gray-400 mb-1.5">
                    Service{appointment.isCustom ? "s" : ""}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {String(serviceText || "")
                      .split(",")
                      .filter(Boolean)
                      .map((s, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center rounded-full border border-indigo-500/30 bg-gray-800/70 px-2.5 py-1 text-[10px] sm:text-[11px] text-gray-200"
                        >
                          {s.trim()}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Status (only the 4) */}
                <div className="mt-3">
                  <label className="text-xs text-gray-400">
                    Appointment status
                  </label>
                  <select
                    value={nextStatus}
                    onChange={(e) => setNextStatus(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-700/70 bg-gray-900/70 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Floating label textarea */}
              <div className="relative group">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="peer w-full h-32 resize-none rounded-xl text-white bg-gray-900/70 border  border-gray-700/70 px-3.5 pt-5 pb-2 text-[12px] md:text-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
                  placeholder="Type your message here"
                />
                <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                  <span>This will be sent as an SMS.</span>
                  <span className="tabular-nums">{message.length} chars</span>
                </div>
              </div>
            </div>

            {/* Sticky footer actions */}
            <div className="sticky bottom-0 px-5 py-4 border-t border-gray-700/70 bg-gray-800/95 rounded-b-2xl">
              <div className="flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg border border-gray-700/70 bg-gray-800 hover:bg-gray-700 text-sm text-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-sm text-white shadow-lg shadow-green-900/25 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
          {/* /Card */}
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
