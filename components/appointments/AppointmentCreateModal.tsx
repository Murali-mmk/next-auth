"use client";

import { useState } from "react";

interface AppointmentCreateModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AppointmentCreateModal({
  onClose,
  onSuccess,
}: AppointmentCreateModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    scheduledAt: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await fetch("/api/appointments", {
      method: "POST",
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-lg font-semibold mb-4">
          Create Appointment
        </h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Title"
          required
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
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
          required
          value={form.scheduledAt}
          onChange={(e) =>
            setForm({ ...form, scheduledAt: e.target.value })
          }
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
            className="px-4 py-2 bg-green-600 text-white"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
