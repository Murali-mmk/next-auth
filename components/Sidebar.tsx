"use client";

import { usePathname, useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Appointments", path: "/dashboard/appointments" },
  { label: "Users", path: "/dashboard/users" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
      {/* Logo / Title */}
      <div className="p-6 text-2xl font-bold border-b border-gray-800">
        Admin Panel
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-4 py-2 rounded-lg transition
                ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <LogoutButton />
      </div>
    </aside>
  );
}
