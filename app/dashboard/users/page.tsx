"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: { name: string };
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users", {
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUsers(data.users || []);
      setLoading(false);
    };

    fetchUsers();
  }, [router]);

  if (loading) return <p className="text-white">Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold">
              {user.name || "No name"}
            </h2>
            <p className="text-gray-400">{user.email}</p>
            <p className="mt-2 text-blue-400">{user.role.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
