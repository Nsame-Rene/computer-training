import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session.userId || session.role !== "student") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get student ID from session
    const student = await prisma.student.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Fetch certificates for this student
    const certificates = await prisma.certificate.findMany({
      where: { studentId: student.id },
      orderBy: { issuedDate: "desc" },
    });

    return NextResponse.json(certificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificates" },
      { status: 500 }
    );
  }
}


// Students can request a certificate from their dashboard. CEO users see the
// pending request immediately in the existing certificate management dashboard.
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session.userId || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const student = await prisma.student.findUnique({ where: { userId: session.userId } });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const title = typeof body.title === "string" && body.title.trim()
      ? body.title.trim()
      : `Certificate request for ${student.program}`;

    const pendingRequest = await prisma.certificate.create({
      data: {
        certNo: `REQ-${Date.now()}-${student.id}`,
        studentId: student.id,
        title,
        status: "pending",
        issuedDate: null,
      },
    });

    return NextResponse.json(pendingRequest, { status: 201 });
  } catch (error) {
    console.error("Error requesting certificate:", error);
    return NextResponse.json({ error: "Failed to request certificate" }, { status: 500 });
  }
}
