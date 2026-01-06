"use client";

import { useState } from "react";
import AppointmentEditModal from "./AppointmentEditModal";

export default function AppointmentTable({ appointments, onRefresh }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    await fetch(`/api/appointments/${id}/`, {
      method: "DELETE",
      credentials: "include",
    });

    onRefresh();
  };

  return (
    <>
      <table className="w-full border border-gray-300 text-sm text-white">
        <thead className="bg-transparent-100">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Scheduled At</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((a) => (
            <tr key={a.id} className="border">
              <td className="p-2 border">{a.title}</td>
              <td className="p-2 border">{a.description || "-"}</td>
              <td className="p-2 border">
                {new Date(a.scheduledAt).toLocaleString()}
              </td>
              <td className="p-2 border space-x-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  onClick={() => setSelectedId(a.id)}
                >
                  Edit
                </button>

                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleDelete(a.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedId && (
        <AppointmentEditModal
          appointmentId={selectedId}
          onClose={() => setSelectedId(null)}
          onSuccess={() => {
            setSelectedId(null);
            onRefresh();
          }}
        />
      )}
    </>
  );
}
