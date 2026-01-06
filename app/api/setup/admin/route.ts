import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const adminEmail = "admin@test.com";
  const adminPassword = "admin123";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    return Response.json(
      { message: "Admin already exists" },
      { status: 400 }
    );
  }

  const adminRole = await prisma.role.findUnique({
    where: { name: "admin" },
  });

  if (!adminRole) {
    return Response.json(
      { message: "Admin role not found" },
      { status: 500 }
    );
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: "Super Admin",
      roleId: adminRole.id,
    },
  });

  return Response.json({ message: "Admin created successfully" });
}
