"use client";

import { useEffect, useState } from "react";
import AppointmentTable from "@/components/appointments/AppointmentTable";
import AppointmentCreateModal from "@/components/appointments/AppointmentCreateModal";

export default function AppointmentsPage() {
   const [appointments, setAppointments] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const fetchAppointments = async () => {
    const res = await fetch("/api/appointments", {
      credentials: "include",
    });
    const data = await res.json();
    setAppointments(data.appointments || []);
  };

useEffect(() => {
  let isMounted = true;

  const load = async () => {
    const res = await fetch("/api/appointments", {
      credentials: "include",
    });

    const data = await res.json();

    if (isMounted) {
      setAppointments(data.appointments || []);
    }
  };

  load();

  return () => {
    isMounted = false;
  };
}, []);

  return (
     <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-white">Appointments</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + Create Appointment
        </button>
      </div>

      <AppointmentTable
        appointments={appointments}
        onRefresh={fetchAppointments}
      />

      {showCreate && (
        <AppointmentCreateModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => {
            setShowCreate(false);
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
}
