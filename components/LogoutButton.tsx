// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Call a logout API to clear cookie (optional but clean)
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    // Redirect to login
    router.push("/login");
    router.refresh(); // Optional: force refresh to clear any cached data
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
    >
      Logout
    </button>
  );
}