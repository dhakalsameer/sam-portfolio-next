import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const profile = await prisma.profile.findFirst({
    include: { photos: { orderBy: { order: "asc" } }, roles: true },
  })
  return NextResponse.json(profile)
}
