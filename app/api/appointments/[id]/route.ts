// app/api/appointments/[id]/route.ts
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { log } from "console";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET (
  req: Request,
  context: {params: Promise <{id: string}>}
){
  try{
    const {id} = await context.params
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id){
      return NextResponse.json(
        {error: "Unauthorized"},
        {status: 401}
      )
    }

    const appointment = await prisma.appointment.findUnique({ where: {id}})

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {sucess: true, 
        appointment
      },
      {status: 200}
    )

  }
  catch(err) {
    return NextResponse.json(
        { error: `Internal Server Error ${err}` },
        { status: 500 }
      )
  }
}

export async function PUT (
  req: Request,
  context: {params: Promise<{id: string}>}
){
  try{
    const {id} = await context.params
    const session = await getServerSession(authOptions)
    if(!session || !session.user?.id){
      return NextResponse.json(
        { error: `Unauthorized` },
        { status: 401 }
      )
    }
    const body = await req.json()
    // Optional: validate input
    if (!body) {
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id,
        createdById: session.user.id
      },
    })
    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found or access denied" },
        { status: 404 }
      );
    }

    if (body.scheduledAt !== undefined) {
      body.scheduledAt = new Date(body.scheduledAt);
    }

    const updatedAppointment = await prisma.appointment.update({
      where: {id},
      data: body,
    })
    if (!updatedAppointment){
      return NextResponse.json(
        { error: "Nothing to update" },
        { status: 400 }
      );
    }
    return NextResponse.json(
        { sucess: true,
          updatedAppointment
        },
        { status: 200 }
      );
  }
  catch(err){
    return NextResponse.json(
        { error: `Internal Server Error ${err}` },
        { status: 500 }
      )
  }
}

export async function DELETE (
  req: Request,
  context: {params: Promise<{id: string}>}
){
  try{
    const {id} = await context.params
    const session = await getServerSession(authOptions)
    if(!session || !session.user?.id){
      return NextResponse.json(
        {error: 'Unauthorised'},
        {status: 401}
      )
    }
    // 🔐 Ensure ownership (important)
    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        createdById: session.user.id,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found or access denied" },
        { status: 404 }
      );
    }


    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: `Appointment deleted sucessfully`},
      {status: 200}
    )

  }
  catch(err){
    return NextResponse.json(
      {message: `Internal server Error ${err}`},
      {status: 500}
    )
  }
}
