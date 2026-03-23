// AdminInvoicedAppointments.jsx
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import InvoiceForm from "./InvoiceForm";
import { FiChevronDown, FiChevronUp, FiChevronRight } from "react-icons/fi";
import Swal from "sweetalert2";

// const API_BASE_URL = "https://nvsalonbackend.dockyardsoftware.com/api";
// const INVOICE_API_URL = `https://nvsalonbackend.dockyardsoftware.com/api/Appointment/sendInvoices`;

// https://localhost:7014/api
// https://localhost:7014/api/Appointment/sendInvoices

const API_BASE_URL = "https://nvsalonbackend.dockyardsoftware.com/api";
const INVOICE_API_URL = `https://nvsalonbackend.dockyardsoftware.com/api/Appointment/sendInvoices`;

// `https://localhost:7014/api/Appointment/sendInvoices`;
export default function AdminInvoicedAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Invoice modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceAppt, setInvoiceAppt] = useState(null);

  // expand/collapse for custom rows
  const [expanded, setExpanded] = useState(new Set());
  const toggleExpand = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  //To store the sent ids in a session.
  // const SENT_KEY = "invoicedApptIds_v1";

  // const getSentIds = () => {
  //   try {
  //     const raw = localStorage.getItem(SENT_KEY);
  //     return new Set(JSON.parse(raw || "[]"));
  //   } catch {
  //     return new Set();
  //   }
  // };
  // const saveSentIds = (set) => {
  //   localStorage.setItem(SENT_KEY, JSON.stringify(Array.from(set)));
  // };

  const openInvoice = (appt) => {
    setInvoiceAppt(appt);
    setShowInvoiceModal(true);
  };
  const handleSendInvoice = async (payload) => {
    // console.log("[Parent] received payload ←", payload);
    try {
      await fetch(`${INVOICE_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentDate: payload.pDate,
          appointmentTime: payload.pTime,
          appointmentStatus: payload.pStatus,
          userName: payload.pName,
          phoneNo: payload.pPhone,
        }),
      });
      await Swal.fire({
        title: "Invoice Sent",
        html: "<div class='text-center text-gray-200'>The invoice was sent successfully.</div>",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });
      closeInvoice();

      setAppointments((prev) =>
        prev.map((a) => (a.id === payload.pId ? { ...a, sent: true } : a))
      );
    } catch (err) {
      console.error(err);
      await Swal.fire({
        title: "Invoice Failed",
        html: `<div class='text-center text-gray-200'>${(
          err?.message || "Could not send the invoice"
        ).replace(/</g, "&lt;")}</div>`,
        icon: "error",
        background: "#1e1b4b",
        color: "#ffffff",
        confirmButtonText: "OK",
        confirmButtonColor: "#6366f1",
        customClass: { popup: "rounded-xl border-2 border-indigo-500" },
      });
    }
  };

  const closeInvoice = () => {
    setShowInvoiceModal(false);
    setInvoiceAppt(null);
  };

  const getStaffNameById = (id) => {
    const staff = staffList.find((s) => s.Id === id);
    return staff ? staff.Name : "Unassigned";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const toYMDLocal = (v) => {
      if (!v) return "N/A";
      const d = new Date(v);
      return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
    };

    async function load() {
      setLoading(true);
      setError(null);
      try {
        // 1) Staff list (for "Assigned To" name)
        const staffResp = await axios.get(
          `${API_BASE_URL}/AdminAuth/staffview`,
          {
            headers,
          }
        );
        setStaffList(staffResp?.data?.staff || []);

        // 2) All appointments, then map + filter to completed only
        const apptResp = await axios.get(`${API_BASE_URL}/Appointment/all`, {
          headers,
        });

        // const mapped = (apptResp?.data || []).map((appt) => ({
        //   id: appt.Id,
        //   client: appt.User?.Name || appt.UserName || "N/A",
        //   service: appt.ServiceName || "N/A",
        //   phone: appt.Phone || "N/A",
        //   date: appt.AppointmentDate ? toYMDLocal(appt.AppointmentDate) : "N/A",
        //   time: appt.AppointmentTime || "N/A",
        //   status: appt.Status || "Pending",
        //   staffId: appt.StaffId || null,
        //   userName: appt.User?.UserName || appt.UserName || "",
        //   price: appt.Price || 0,
        // }));

        // each DB row is (appointment × one service)
        const rows = apptResp?.data || [];
        const grouped = new Map();

        for (const r of rows) {
          const id = r.Id;
          if (!grouped.has(id)) {
            grouped.set(id, {
              id,
              client: r.User?.Name || r.UserName || "N/A",
              userName: r.User?.UserName || r.UserName || "",
              phone: r.Phone || r.UserPhone || "N/A",
              date: r.AppointmentDate ? toYMDLocal(r.AppointmentDate) : "N/A",
              time: r.AppointmentTime || "N/A",
              status: r.Status || "Pending",
              staffId: r.StaffId || null,

              items: [], // [{name, price}]
              totalPrice: 0, // sum of item prices
              service: "", // display label
              price: 0,
              isCustom: false,
            });
          }
          const ap = grouped.get(id);
          const svcName = r.ServiceName || "N/A";

          const svcPrice = Number(r.ServicePrice ?? 0);
          ap.items.push({ name: svcName, price: svcPrice });
          ap.totalPrice += svcPrice;
        }

        const mapped = Array.from(grouped.values()).map((ap) => {
          ap.isCustom = ap.items.length > 1;
          if (ap.isCustom) {
            ap.service = `Custom (${ap.items.length})`;
            ap.price = ap.totalPrice;
          } else {
            const only = ap.items[0] || { name: "N/A", price: 0 };
            ap.service = only.name;
            ap.price = Number(only.price || 0);
          }
          return ap;
        });

        // Only keep completed
        const completedOnly = mapped.filter(
          (a) => String(a.status).toLowerCase() === "completed"
        );
        // Sort by ID descending
        completedOnly.sort((a, b) => b.id - a.id);

        // const sentIds = getSentIds();
        setAppointments(completedOnly);
        // setAppointments(
        //   completedOnly.map((a) => ({ ...a, sent: sentIds.has(a.id) }))
        // );
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load appointments"
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title + subtitle */}
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          Your Completed Appointments
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Generate invoices for completed bookings.
        </p>

        {/* Table Card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 shadow-2xl shadow-black/30 backdrop-blur-sm">
          {loading ? (
            <p className="text-center text-gray-400 py-10">
              Loading completed appointments…
            </p>
          ) : error ? (
            <p className="text-center text-red-500 py-10">{error}</p>
          ) : appointments.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              No completed appointments found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-sm">
                  <tr>
                    <th className="w-8 px-2 py-3 border-b border-gray-800"></th>
                    <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
                      No
                    </th>
                    <th className="px-4 py-3 text-left border-b border-gray-800 text-sm font-semibold tracking-wide  text-gray-200">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
                      Time
                    </th>
                    {/* Status intentionally hidden — all are Completed */}
                    <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
                      Price
                    </th>
                    {/* <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
                      Assigned To
                    </th> */}
                    <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-gray-800 text-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-800">
                  {appointments.map((appt) => (
                    <Fragment key={appt.id}>
                      <tr className="bg-gray-900/30 hover:bg-gray-800/60 transition">
                        <td className="px-4 py-3 text-sm border-b border-gray-800 whitespace-nowrap">
                          <div className="flex items-center gap-6">
                            {appt.isCustom ? (
                              <button
                                onClick={() => toggleExpand(appt.id)}
                                onKeyDown={(e) =>
                                  (e.key === "Enter" || e.key === " ") &&
                                  toggleExpand(appt.id)
                                }
                                className="p-1 rounded hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                                title={
                                  expanded.has(appt.id)
                                    ? "Hide sub services"
                                    : "Show sub services"
                                }
                                aria-label={
                                  expanded.has(appt.id)
                                    ? "Hide sub services"
                                    : "Show sub services"
                                }
                                aria-expanded={expanded.has(appt.id)}
                              >
                                {expanded.has(appt.id) ? (
                                  <FiChevronUp />
                                ) : (
                                  <FiChevronDown />
                                )}
                              </button>
                            ) : (
                              <span className="inline-block w-4" /> /* spacer to align rows */
                            )}
                            {/* <span className="font-medium">{appt.client}</span> */}
                            {/* {appt.isCustom && (
                              <span className="text-xs text-gray-400">
                                ({appt.items?.length ?? 0})
                              </span>
                            )} */}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm border-b border-gray-800 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/30 px-2.5 py-0.5 text-xs font-semibold">
                            {`NO - ${appt.id}`}
                          </span>
                        </td>

                        {/* 🟣 3️⃣ Client name */}
                        <td className="px-4 py-3 text-sm border-b border-gray-800 whitespace-nowrap">
                          <span className="font-medium">{appt.client}</span>
                        </td>

                        <td className="px-4 py-3 text-sm border-b border-gray-800">
                          <span className="line-clamp-1">{appt.service}</span>
                        </td>

                        <td className="px-4 py-3 text-sm border-b border-gray-800 whitespace-nowrap">
                          {appt.phone}
                        </td>

                        <td className="px-4 py-3 text-sm border-b border-gray-800 whitespace-nowrap">
                          {appt.date}
                        </td>

                        <td className="px-4 py-3 text-sm border-b border-gray-800 whitespace-nowrap">
                          {formatTimeTo12h(appt.time)}
                        </td>

                        <td className="px-4 py-3 text-sm border-b border-gray-800 whitespace-nowrap">
                          {/* {appt.price.toLocaleString("en-LK", {
                          style: "currency",
                          currency: "LKR",
                        })} */}
                          {Number(appt.price).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        {/* 
                        <td className="px-4 py-3 text-sm border-b border-gray-800 whitespace-nowrap">
                          {appt.staffId ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-400" />
                              {getStaffNameById(appt.staffId)}
                            </span>
                          ) : (
                            <span className="text-gray-400">Unassigned</span>
                          )}
                        </td> */}

                        <td className="px-4 py-3 text-sm border-b border-gray-800">
                          {/* {!appt.sent? (<button
                            onClick={() => openInvoice(appt)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-sm px-3 py-1.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition"
                            title="Generate Invoice"
                          >
                            Generate Invoice
                          </button>):(
                            <span className="text-gray-80 text-sm font-bold">Invoice Sent</span>
                          )}  */}
                          <button
                            onClick={() => openInvoice(appt)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-sm px-3 py-1.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition"
                            title="Generate Invoice"
                          >
                            Generate Invoice
                          </button>
                        </td>
                      </tr>

                      {appt.isCustom && expanded.has(appt.id) && (
                        <tr className="bg-gray-900/40">
                          <td colSpan={10} className="">
                            <div>
                              {/* <div className="text-xs uppercase tracking-wide text-gray-400 flex items-center gap-2">
                                <FiChevronRight /> Services in this appointment
                              </div> */}
                              <div className=" overflow-hidden  ">
                                <table className="w-full text-sm bg-indigo-900/60">
                                  <thead className="bg-indigo-900/60 align-middle ">
                                    <tr>
                                      <th className="text-center px-10 py-2  col-span-2">
                                        No
                                      </th>

                                      <th className="text-center px-20  py-2   col-span-4  ">
                                        Service
                                      </th>
                                      <th className="text-center px-2  py-2  ">
                                        Price (LKR)
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {appt.items.map((it, i) => (
                                      <tr key={i} className="">
                                        <td className="px-4 py-2  text-center">
                                          {i + 1}
                                        </td>
                                        <td className="px-4 py-2  text-center">
                                          {it.name}
                                        </td>
                                        <td className="px-4 py-2  text-center">
                                          {Number(it.price || 0).toLocaleString(
                                            "en-US",
                                            {
                                              minimumFractionDigits: 2,
                                              maximumFractionDigits: 2,
                                            }
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                    <tr className="text-md bg-indigo-900/60 font-bold ">
                                      <td
                                        colSpan={2}
                                        className="px-4 py-2 font-semibold text-center"
                                      >
                                        Total
                                      </td>
                                      <td className="px-3 py-2 font-medium col-span-4  text-center">
                                        {Number(
                                          appt.totalPrice || 0
                                        ).toLocaleString("en-LK", {
                                          style: "currency",
                                          currency: "LKR",
                                          minimumFractionDigits: 2,
                                        })}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showInvoiceModal && invoiceAppt && (
          <InvoiceForm
            appointments={invoiceAppt}
            onClose={closeInvoice}
            onSent={handleSendInvoice}
          />
        )}
      </div>
    </div>
  );
}
