import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all outputs
export async function GET() {
  const outputs = await prisma.output.findMany();
  return NextResponse.json(outputs);
}

// POST new output
export async function POST(request: Request) {
  const body = await request.json();
  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Missing title or content" },
      { status: 400 }
    );
  }

  const newOutput = await prisma.output.create({
    data: { title, content },
  });

  return NextResponse.json(newOutput, { status: 201 });
}

// PUT to update existing output
export async function PUT(request: Request) {
  const data = await request.json();
  const updated = await prisma.output.update({
    where: { id: data.id },
    data: data,
  });
  return NextResponse.json(updated);
}

// DELETE an output
export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await prisma.output.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
