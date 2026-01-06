// app/api/appointments/route.ts
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  console.log("9999999999999999999999", session.token)

  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  console.log("16666666666666", session.user)

  const body = await req.json();

  const appointment = await prisma.appointment.create({
    data: {
      title: body.title,
      description: body.description,
      scheduledAt: new Date(body.scheduledAt),
      createdById: session.user.id,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Appointment created successfully",
      appointment,
    },
    { status: 201 }
  );
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }


  const appointments = await prisma.appointment.findMany()

  return NextResponse.json(
    {
      success: true,
      message: "Appointment fetched successfully",
      appointments,
    },
    { status: 201 }
  );
}






