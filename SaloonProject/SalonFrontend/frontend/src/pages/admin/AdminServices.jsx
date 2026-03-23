import React, { useEffect, useMemo, useState } from "react";
import { FiEdit2, FiFilter } from "react-icons/fi";
import AdminAddServiceForm from "./AdminAddService";
import axios from "axios";
import Swal from "sweetalert2";
// https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth
const API_BASE_URL =
  "https://nvsalonbackend.dockyardsoftware.com/api/AdminAuth";
// "https://localhost:7014/api/AdminAuth";

export default function AdminServicePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // const [selectedService, setSelectedService] = useState(null); // not used now, kept for future
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | A | I
  const [editingId, setEditingId] = useState(null);
  const [editedStatuses, setEditedStatuses] = useState({}); // { [id]: "A" | "I" }

  // Seed data (replace with fetch later)
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (!loading) return;
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/get-all-services`);
        console.log(response.data);
        const sorted = response.data.sort((a,b) => b.Id - a.Id);
        setServices(sorted);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch services: ", error.message);
      }
    };
    fetchServices();
  }, [loading]);

  const filtered = useMemo(() => {
    if (statusFilter === "ALL") return services;
    return services.filter((s) => s.Status === statusFilter);
  }, [services, statusFilter]);

  // Inline edit handlers
  const startEdit = (svc) => {
    setEditingId(svc.Id);
    setEditedStatuses((prev) => ({ ...prev, [svc.Id]: svc.Status }));
  };

  const saveEdit = async (id) => {
    const newStatus = editedStatuses[id]; // <— keep as const, don't reassign later
    if (!newStatus) {
      setEditingId(null);
      return;
    }

    const prevServices = services.map((s) => ({ ...s })); // clone for safe revert

    // optimistic UI
    setServices((list) =>
      list.map((s) => (s.Id === id ? { ...s, Status: newStatus } : s))
    );

    const url = `${API_BASE_URL}/${id}/services-status-update`;

    try {
      await axios.put(url, JSON.stringify(newStatus), {
        headers: { "Content-Type": "application/json" },
      });

      setEditedStatuses((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
      setEditingId(null);
    } catch (error) {
      console.error(
        "Failed to update service status:",
        error.response?.status,
        error.response?.data || error.message
      );
      setServices(prevServices); // revert optimistic update
    }
  };

  return (
    <div className="w-full min-h-[100vh] p-10">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-wide">Service Management</h1>

        {/* Right controls: Filter + Add */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-purple-700/40 bg-gray-800/60 px-3 py-2">
            <FiFilter />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent outline-none"
              title="Filter status"
            >
              <option value="ALL" className="text-white bg-gray-800">
                All
              </option>
              <option value="A" className="text-white bg-gray-800">
                Active
              </option>
              <option value="I" className="text-white bg-gray-800">
                Inactive
              </option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-1
      rounded-lg bg-gradient-to-r from-purple-600 to-pink-500
      text-white font-semibold shadow-md hover:shadow-lg hover:opacity-95
      px-6 py-3 text-sm md:px-5 md:py-2 md:text-base transition"
            title="Add Services"
          >
            <span>+ Add</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-y-auto rounded-2xl border  border-purple-700/40 bg-gray-900/40">
        <table className="w-full text-sm">
          <thead className="bg-purple-700/30">
            <tr className="text-left">
              <th className="p-3">Service Id</th>
              <th className="p-3">Service Name</th>
              <th className="p-3">Price (LKR)</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((service) => {
              const isEditing = editingId === service.Id;
              const value =
                editedStatuses[service.Id] !== undefined
                  ? editedStatuses[service.Id]
                  : service.Status;

              return (
                <tr
                  key={service.Id}
                  className="border-t border-purple-800/30 hover:bg-gray-800/60 transition-slow"
                >
                  <td className="p-3">{service.Id}</td>
                  <td className="p-3">{service.Name}</td>
                  <td className="p-3">
                    {Number(service.Price).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  {/* <td className="p-3">{service.Status}</td> */}

                  <td className="p-3">
                    {isEditing ? (
                      <select
                        value={value}
                        onChange={(e) =>
                          setEditedStatuses((prev) => ({
                            ...prev,
                            [service.Id]: e.target.value,
                          }))
                        }
                        className="rounded-md border border-gray-700 bg-gray-800/70 px-2 py-1 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        title="Set status"
                      >
                        <option value="A" className="text-black">
                          Active
                        </option>
                        <option value="I" className="text-black">
                          Inactive
                        </option>
                      </select>
                    ) : (
                      <span
                        className={
                          "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-semibold " +
                          (service.Status === "A"
                            ? "bg-emerald-600/20 text-emerald-300 border border-emerald-700/40"
                            : "bg-rose-600/20 text-rose-300 border border-rose-700/40")
                        }
                      >
                        {service.Status === "A" ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      {isEditing ? (
                        <button
                          onClick={() => saveEdit(service.Id)}
                          title="Save"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(service)}
                          title="Edit"
                          className="inline-flex items-center gap-1 rounded-lg bg-orange-600 px-3 py-1.5 text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                        >
                          <FiEdit2 /> Edit
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No services found for the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AdminAddServiceForm
          onClose={() => setShowAddModal(false)}
          // onAdd={async (payload) => {
          //   try {
          //     const res = await axios.post(`${API_BASE_URL}`, payload, {
          //       headers: { "Content-Type": "application/json" },
          //     });
          //     Swal.fire({
          //       title: "Service Added Successfully",
          //       text: "The new service has been added to the list.",
          //       icon: "success",
          //       background: "#1e1b4b",
          //       color: "#ffffff",
          //       confirmButtonColor: "#6366f1",
          //       customClass: {
          //         popup: "rounded-xl border-2 border-indigo-500",
          //       },
          //       timer: 2000,
          //       showConfirmButton: false,
          //     });

          //     setLoading(true);

          //     setShowAddModal(false);
          //   } catch (error) {
          //     console.error(
          //       "Failed to add service:",
          //       error.response?.status,
          //       error.response?.data || error.message
          //     );
          //   }
          //   Swal.fire({
          //     title: "Failed to Add Service",
          //     text:
          //       "Something went wrong while adding the service. Please try again.",
          //     icon: "error",
          //     background: "#1e1b4b",
          //     color: "#ffffff",
          //     confirmButtonColor: "#6366f1",
          //     customClass: {
          //       popup: "rounded-xl border-2 border-indigo-500",
          //     },
          //   });
          // }}
          onAdd={async (payload) => {
            try {
              const res = await axios.post(`${API_BASE_URL}`, payload, {
                headers: { "Content-Type": "application/json" },
              });

              // If your controller returns 201 Created (CreatedAtAction), this will be true
              if (res.status >= 200 && res.status < 300) {
                Swal.fire({
                  title: "Service Added Successfully",
                  text: "The new service has been added to the list.",
                  icon: "success",
                  background: "#1e1b4b",
                  color: "#ffffff",
                  confirmButtonColor: "#6366f1",
                  customClass: {
                    popup: "rounded-xl border-2 border-indigo-500",
                  },
                  timer: 2000,
                  showConfirmButton: false,
                });

                setLoading(true); // triggers re-fetch
                setShowAddModal(false);
                return; // prevent any fallthrough
              }

              // Non-throwing non-2xx (rare with axios defaults) — treat as error
              Swal.fire({
                title: "Failed to Add Service",
                text: `Unexpected response: ${res.status}`,
                icon: "error",
                background: "#1e1b4b",
                color: "#ffffff",
                confirmButtonColor: "#6366f1",
                customClass: { popup: "rounded-xl border-2 border-indigo-500" },
              });
            } catch (error) {
              console.error(
                "Failed to add service:",
                error.response?.status,
                error.response?.data || error.message
              );

              Swal.fire({
                title: "Failed to Add Service",
                text:
                  error.response?.data?.message ||
                  "Something went wrong while adding the service. Please try again.",
                icon: "error",
                background: "#1e1b4b",
                color: "#ffffff",
                confirmButtonColor: "#6366f1",
                customClass: { popup: "rounded-xl border-2 border-indigo-500" },
              });
            }
          }}
        />
      )}
    </div>
  );
}
