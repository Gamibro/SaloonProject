import React, { useState } from "react";

export default function AdminAddServiceForm({ onClose, onAdd }) {
  const [form, setForm] = useState({
    serviceName: "",
    price: "",
    status: "A",
  });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const priceNumber = Number(String(form.price).replaceAll(",",""));
    const payload = {
      Name:form.serviceName,
      Price:priceNumber,
      Status:form.status
    };
    onAdd(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-[95%] max-w-lg rounded-2xl border border-purple-700/40 bg-gradient-to-b from-gray-900 to-gray-850 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-wide">Add Services</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Service Name</label>
            <input
              type="text"
              value={form.serviceName}
              onChange={(e) => update("serviceName",e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800/70 px-4 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="e.g., Facial"
              required
            />
          </div>

          <div>
            <div>
              <label className="block text-sm mb-1">Price</label>
              <input
                type="text"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800/70 px-4 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="5000"
                required
              />
            </div>
            {/* <div>
              <label className="block text-sm mb-1">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-800/70 px-4 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="45 mins"
                required
              />
            </div> */}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm mb-1">Status</label>
              {/* <p className="text-xs text-gray-400"></p> */}
            </div>
            <select
              value={form.status}
              onChange={(e) => update("status",e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800/70 px-4 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              <option value="A" className="text-black">Active</option>
              <option value="I" className="text-black">Inactive</option>
            </select>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-outline px-4 py-2">
              Cancel
            </button>
            <button type="submit" className="btn-primary px-4 py-2">
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
