"use client";

import { useEffect, useState } from "react";

export default function AppointmentEditModal({
  appointmentId,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledAt: "",
  });

  useEffect(() => {
    const fetchAppointment = async () => {
      const res = await fetch(`/api/appointments/${appointmentId}/`, {
        credentials: "include",
      });
      const data = await res.json();

      const a = data.appointment;
      setForm({
        title: a.title,
        description: a.description || "",
        scheduledAt: a.scheduledAt.slice(0, 16), // for datetime-local
      });
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`/api/appointments/${appointmentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        scheduledAt: form.scheduledAt,
      }),
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">Edit Appointment</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <textarea
          className="w-full border p-2 mb-3"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="datetime-local"
          className="w-full border p-2 mb-4"
          value={form.scheduledAt}
          onChange={(e) =>
            setForm({ ...form, scheduledAt: e.target.value })
          }
          required
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
