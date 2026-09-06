import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { curriculumDrafts } from "@/db/schema";
import { getSessionAdult } from "@/lib/auth";

export async function GET() {
  const admin = await getSessionAdult();

  if (!admin) {
    return Response.json(
      { error: "Sign in required." },
      { status: 401 },
    );
  }

  const db = await getDb();

  const content = await db
    .select()
    .from(curriculumDrafts)
    .orderBy(desc(curriculumDrafts.updatedAt));

  return Response.json({ content });
}

export async function POST(request: Request) {
  const admin = await getSessionAdult();

  if (!admin) {
    return Response.json(
      { error: "Sign in required." },
      { status: 401 },
    );
  }

  const body = await request.json();

  const title =
    typeof body.title === "string"
      ? body.title.trim().slice(0, 120)
      : "";

  const lessonId =
    typeof body.lessonId === "string"
      ? body.lessonId.trim()
      : null;

  const level =
    typeof body.level === "string"
      ? body.level.trim()
      : "";

  const status =
    typeof body.status === "string"
      ? body.status
      : "draft";

  if (!title || !level) {
    return Response.json(
      { error: "Title and level are required." },
      { status: 400 },
    );
  }

  const db = await getDb();

  const [content] = await db
    .insert(curriculumDrafts)
    .values({
      id: crypto.randomUUID(),
      ownerEmail: admin.email,
      lessonId,
      title,
      level,
      status,
      dataJson: JSON.stringify(body.data ?? {}),
      updatedAt: new Date().toISOString(),
    })
    .returning();

  return Response.json(
    { content },
    { status: 201 },
  );
}
