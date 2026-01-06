"use client";

export default function DashboardHome() {
  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl mt-2 text-blue-400">—</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold">Appointments</h2>
          <p className="text-3xl mt-2 text-green-400">—</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold">Active Sessions</h2>
          <p className="text-3xl mt-2 text-purple-400">—</p>
        </div>
      </div>
    </div>
  );
}
