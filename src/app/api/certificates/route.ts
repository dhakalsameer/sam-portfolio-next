import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const certificates = await prisma.certification.findMany({
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(certificates)
}
