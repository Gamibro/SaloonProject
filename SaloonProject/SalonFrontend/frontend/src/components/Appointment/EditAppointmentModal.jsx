import { useEffect, useMemo, useState } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import Swal from "sweetalert2";

// Pass these from the page or hardcode like the page does
// const API_BASE_URL = "https://localhost:7014/api";
// const ADMIN_API_BASE_URL = "https://localhost:7014/api/AdminAuth";
// https://localhost:7014/api
// https://localhost:7014/api/AdminAuth

export default function EditAppointmentModal({
  apiBase = "https://nvsalonbackend.dockyardsoftware.com/api",
  adminApiBase = "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth",
  appt,
  onClose,
  onSaved,
}) {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const isCustom = Boolean(appt?.isCustom);

  // read-only copies
  const [client] = useState(appt?.client ?? "N/A");
  const [date] = useState(appt?.date ?? "N/A");
  const [time] = useState(appt?.time ?? "N/A");

  // editable status
  const [status, setStatus] = useState(appt?.status ?? "Pending");
  const [prevStatus] = useState(appt?.status ?? "Pending"); // what the status was before opening the modal

  // services UI
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [activeServices, setActiveServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [pickedStaffId, setPickedStaffId] = useState(appt?.staffId || "");
  const staffAssignedInitially = Boolean(appt?.staffId);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${adminApiBase}/staffview`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        const allowedRoles = ["stylist", "barber", "senior stylist"];

        const filtered = (data.staff || []).filter((s) =>
          allowedRoles.includes(s.Role.toLowerCase())
        );

        setStaffList(filtered);
      } catch (e) {
        console.error("Staff load failed:", e);
      }
    };

    fetchStaff();
  }, []);
  // selected services to be *applied* (what user sees in the form)
  // For custom: multiple; for single: exactly one (or none initially).
  const [pickedIds, setPickedIds] = useState(() => {
    if (isCustom && Array.isArray(appt?.items)) {
      // We don’t have the type IDs here; start empty; user can re-pick.
      return [];
    }
    return []; // single-service: start empty => shows current service name above
  });

  // “Pending changes” area displayed under Services label for custom
  const [displayItems, setDisplayItems] = useState(() => {
    if (isCustom && Array.isArray(appt?.items)) {
      return appt.items.map((it) => ({
        name: it.name,
        price: Number(it.price || 0),
      }));
    }
    // single service shows current name in its field, not below
    return [];
  });

  const singleServiceName = useMemo(() => {
    if (isCustom) return `Custom (${displayItems.length})`;
    // for single-service, show whatever came from the row
    return appt?.service || "N/A";
  }, [appt?.service, isCustom, displayItems.length]);

  const totalPrice = useMemo(
    () => displayItems.reduce((s, it) => s + (Number(it.price) || 0), 0),
    [displayItems]
  );
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

  const formattedDateForApi = (d) => {
    const ymd = /^\d{4}-\d{2}-\d{2}$/.test(d)
      ? d
      : new Date(d).toLocaleDateString("en-CA"); // YYYY-MM-DD
    return `${ymd}T00:00:00.0000000`;
  };

  const formattedTimeForApi = (t) =>
    t && t.length === 5 ? `${t}:00` : t || "";

  const apptIdText = useMemo(
    () => (appt?.id != null ? `NO-${appt.id}` : "your appointment"),
    [appt?.id]
  );

  const buildSmsMessage = () => {
    const s = String(status || "").toLowerCase();
    const time12 = formatTimeTo12h(appt?.time);
    return `Your appointment ${apptIdText} is ${s} on ${appt?.date} at ${time12}.`;
  };

  const loadActiveServices = async () => {
    if (!token) throw new Error("Authentication token missing");
    setLoadingServices(true);
    try {
      const res = await fetch(`${adminApiBase}/active-services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : data.services || data.data || [];
      setActiveServices(
        list.map((s) => ({
          id: Number(s.Id ?? s.id),
          name: s.Name ?? s.name,
          price: Number(s.Price ?? s.price ?? 0),
        }))
      );
    } catch (e) {
      await Swal.fire({
        title: "Failed to load services",
        text: String(e?.message || e),
        icon: "error",
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });
    } finally {
      setLoadingServices(false);
    }
  };

  const openPicker = async () => {
    if (!pickerOpen) {
      await loadActiveServices();
    }
    setPickerOpen(true);
  };
  const closePicker = () => setPickerOpen(false);

  const toggleCheckbox = (id) => {
    setPickedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const setRadio = (id) => setPickedIds([id]);

  const commitPickedServices = () => {
    if (isCustom) {
      if (pickedIds.length === 0) {
        Swal.fire({
          title: "Select at least one service",
          icon: "warning",
          background: "#1e1b4b",
          color: "#ffffff",
          confirmButtonColor: "#6366f1",
          customClass: { popup: "rounded-xl border-2 border-indigo-500" },
        });
        return;
      }
      const chosen = activeServices.filter((s) => pickedIds.includes(s.id));
      setDisplayItems(chosen.map((c) => ({ name: c.name, price: c.price })));
      closePicker();
    } else {
      if (pickedIds.length !== 1) {
        Swal.fire({
          title: "Pick one service",
          icon: "warning",
          background: "#1e1b4b",
          color: "#ffffff",
          confirmButtonColor: "#6366f1",
          customClass: { popup: "rounded-xl border-2 border-indigo-500" },
        });
        return;
      }
      const sel = activeServices.find((s) => s.id === pickedIds[0]);
      // Replace label (service name) shown for single-service
      if (sel) {
        // mimic row’s single service display via name replacement
        appt.service = sel.name;
      }
      closePicker();
    }
  };

  const handleSendMessage = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const message = buildSmsMessage();

    // 1) Show confirmation with the exact message
    const { isConfirmed } = await Swal.fire({
      title: "Send this message?",
      html: `<div class='text-center text-gray-200 text-sm whitespace-pre-line'>${message}</div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, send",
      cancelButtonText: "Cancel",
      background: "#1e1b4b",
      color: "#ffffff",
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#6b7280",
      customClass: { popup: "rounded-xl border-2 border-indigo-500" },
    });

    // If cancelled → do nothing, don't call API
    if (!isConfirmed) return;

    try {
      // 2) Call the same sendMessages API as MessageModal
      const smsRes = await fetch(`${apiBase}/Appointment/sendMessages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNo: appt.phone,
          message,
          AppointmentDate: formattedDateForApi(appt.date),
          AppointmentTime: formattedTimeForApi(appt.time),
        }),
      });

      if (!smsRes.ok) {
        throw new Error(await smsRes.text());
      }

      // 3) Success toast – DO NOT close the Edit modal
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
    } catch (e) {
      await Swal.fire({
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

  const handleSave = async () => {
    if (!token) return;
    // If attempting to complete with no assigned staff → block and revert
    const wantsCompleted = String(status).toLowerCase() === "completed";
    // const hasStaff = Boolean(appt?.staffId); // comes from AdminAppointmentsPage mapping
    const effectiveHasStaff = Boolean(appt?.staffId) || Boolean(pickedStaffId);
    if (wantsCompleted && !effectiveHasStaff) {
      await Swal.fire({
        title: "Staff is unassigned",
        text: `Assign a staff member to No-${appt.id} before marking it Completed.`,
        icon: "warning",
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });
      // Keep modal open and reset the select back to the previous saved value
      setStatus(prevStatus);
      return; // stop here; do not call the API
    }

    // Completed confirmation
    if (wantsCompleted) {
      const { isConfirmed } = await Swal.fire({
        title: "Mark as Completed?",
        html: "<div class='text-gray-200'>This will be marked completed and removed from the list.</div>",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, mark completed",
        cancelButtonText: "Cancel",
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
        cancelButtonColor: "#6b7280",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });
      if (!isConfirmed) {
        // Just dismiss the dialog; modal stays open and we revert the dropdown
        setStatus(prevStatus);
        return;
      }
    }

    // Build payload
    const payload = {
      AppointmentDate: appt.date, // read-only in this modal
      AppointmentTime: appt.time.length === 5 ? `${appt.time}:00` : appt.time,
      Status: status,
      IsCustom: isCustom, // single-service sends false; custom sends true
      ServiceTypeIds: isCustom
        ? pickedIds // may be empty if user didn't touch services; backend can handle
        : pickedIds.slice(0, 1), // single service: 0 or 1 id
    };

    try {
      if (pickedStaffId && pickedStaffId !== appt?.staffId) {
        try {
          const assignRes = await fetch(`${adminApiBase}/assign-staff`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              AppointmentId: appt.id,
              StaffId: Number(pickedStaffId),
            }),
          });

          if (!assignRes.ok) {
            throw new Error("Failed to assign staff");
          }

          appt.staffId = Number(pickedStaffId); // update locally
        } catch (e) {
          await Swal.fire({
            title: "Staff Assignment Failed",
            text: String(e?.message || e),
            icon: "error",
            background: "#1e1b4b",
            color: "#ffffff",
            confirmButtonColor: "#6366f1",
          });
          return; // IMPORTANT: do not continue to save appointment
        }
      }
      const res = await fetch(`${apiBase}/Appointment/${appt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error((await res.text()) || "Failed to update appointment");
      }

      const completed = String(status).toLowerCase() === "completed";
      await Swal.fire({
        title: `Appointment ${appt.id} updated`,
        text: completed
          ? "You can check your record in Invoice Generation."
          : "Changes saved successfully.",
        icon: "success",
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });

      // Build back an updated appointment object for the page to merge
      const updated = {
        ...appt,
        status,
        // For custom, reflect possible new items + total; For single service, reflect label change
        ...(isCustom
          ? {
              items: displayItems.slice(),
              price: displayItems.reduce(
                (s, it) => s + (Number(it.price) || 0),
                0
              ),
              service: `Custom (${displayItems.length})`,
              isCustom: true,
            }
          : {
              service: appt.service, // may have been changed through radio picker
              isCustom: false,
            }),
      };

      onSaved(updated);
    } catch (e) {
      await Swal.fire({
        title: "Update failed",
        text: String(e?.message || e),
        icon: "error",
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto  rounded-2xl border border-gray-800/70 sm:border-gray-800 bg-gray-900/90 sm:bg-gray-900/95 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 sticky top-0 bg-gray-900/95 z-10">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-100">
              Edit Appointment
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{`NO-${appt.id}`}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-300"
            title="Close"
          >
            <FiX />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Client / Date / Time - read-only */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400">Client</label>
              <div className="mt-1 px-3 py-2 rounded-lg border border-gray-800 bg-gray-800/40 text-sm text-gray-200">
                {client}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400">Date</label>
              <div className="mt-1 px-3 py-2 rounded-lg border border-gray-800 bg-gray-800/40 text-sm text-gray-200">
                {date}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400">Time</label>
              <div className="mt-1 px-3 py-2 rounded-lg border border-gray-800 bg-gray-800/40 text-sm text-gray-200">
                {formatTimeTo12h(time)}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-800 bg-gray-800/70 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
              >
                <option value="Pending">Pending</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400">Assign Staff</label>
              <select
                value={pickedStaffId}
                onChange={(e) => {
                  const value = e.target.value;

                  if (value === "" && staffAssignedInitially) {
                    return;
                  }
                  setPickedStaffId(value);
                }}
                className="mt-1 w-full rounded-lg border border-gray-800 bg-gray-800/70 px-3 py-2 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
              >
                <option
                  value=""
                  disabled={staffAssignedInitially}
                  className={
                    staffAssignedInitially
                      ? "cursor-not-allowed text-gray-400 "
                      : ""
                  }
                >
                  No Staff Assigned
                </option>
                {staffList.map((s) => (
                  <option key={s.Id} value={s.Id}>
                    {s.Name} (Id: {s.Id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs text-gray-400">
                  {isCustom ? "Services" : "Service"}
                </label>
                <div className="mt-1 text-sm text-gray-200">
                  {isCustom ? (
                    <span>Custom ({displayItems.length})</span>
                  ) : (
                    <span className="line-clamp-1">{singleServiceName}</span>
                  )}
                </div>
              </div>

              <button
                onClick={pickerOpen ? () => setPickerOpen(false) : openPicker}
                className="inline-flex items-center gap-1 rounded-lg border border-gray-800 bg-gray-800/50 px-3 py-2 text-sm text-gray-200 hover:bg-gray-800"
              >
                <FiChevronDown />
                {pickerOpen ? "Hide" : "Choose"}
              </button>
            </div>

            {/* Picker */}
            {pickerOpen && (
              <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-3">
                {loadingServices ? (
                  <div className="text-sm text-gray-400">Loading…</div>
                ) : activeServices.length === 0 ? (
                  <div className="text-sm text-gray-400">
                    No active services found.
                  </div>
                ) : (
                  <div className="max-h-56 overflow-auto space-y-2 pr-1">
                    {activeServices.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center justify-between gap-3 rounded-md border border-gray-800 bg-gray-800/40 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          {isCustom ? (
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={pickedIds.includes(s.id)}
                              onChange={() => toggleCheckbox(s.id)}
                            />
                          ) : (
                            <input
                              type="radio"
                              name="single-service"
                              className="h-4 w-4"
                              checked={pickedIds[0] === s.id}
                              onChange={() => setRadio(s.id)}
                            />
                          )}
                          <span className="text-sm">{s.name}</span>
                        </div>
                        <span className="text-sm tabular-nums">
                          {Number(s.price || 0).toLocaleString("en-LK", {
                            style: "currency",
                            currency: "LKR",
                          })}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={commitPickedServices}
                    className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1.5 rounded-lg font-medium"
                  >
                    Add
                  </button>
                  <button
                    onClick={closePicker}
                    className="bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1.5 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Custom: show line-items + total */}
            {isCustom && displayItems.length > 0 && (
              <div className="mt-2 rounded-lg border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  {/* Header row */}
                  <div className="grid grid-cols-12 bg-gray-900/70 text-xs sm:text-[13px] text-gray-300">
                    <div className="col-span-2 px-3 py-2">No</div>
                    <div className="col-span-7 px-3 py-2 text-center">
                      Service
                    </div>
                    <div className="col-span-3 px-3 py-2 text-center">
                      Amount (LKR)
                    </div>
                  </div>

                  {/* Item rows */}
                  {displayItems.map((it, idx) => (
                    <div
                      key={`${idx}-${it.name}`}
                      className="grid grid-cols-12 bg-gray-900/40 text-xs sm:text-sm"
                    >
                      <div className="col-span-2 px-3 py-2">{idx + 1}</div>
                      <div className="col-span-7 px-3 py-2 text-center break-words">
                        {it.name}
                      </div>
                      <div className="col-span-3 px-3 py-2 text-center tabular-nums">
                        {Number(it.price).toLocaleString("en-LK")}
                      </div>
                    </div>
                  ))}

                  {/* Total row */}
                  <div className="grid grid-cols-12 bg-gray-900/70 text-xs sm:text-sm">
                    <div className="col-span-9 px-3 py-2 font-semibold">
                      Total
                    </div>
                    <div className="col-span-3 px-3 py-2 text-center font-semibold tabular-nums whitespace-nowrap">
                      {totalPrice.toLocaleString("en-LK", {
                        style: "currency",
                        currency: "LKR",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 px-5 py-4 border-t border-gray-800 bg-gray-900/95 sticky bottom-0">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-sm px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-sm px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            Save
          </button>
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-sm px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
