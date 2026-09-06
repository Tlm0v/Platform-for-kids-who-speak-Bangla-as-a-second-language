import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { curriculumDrafts } from "@/db/schema";
import { getSessionAdult } from "@/lib/auth";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  context: Context,
) {
  const admin = await getSessionAdult();

  if (!admin) {
    return Response.json(
      { error: "Sign in required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const body = await request.json();

  const db = await getDb();

  const [updated] = await db
    .update(curriculumDrafts)
    .set({
      title:
        typeof body.title === "string"
          ? body.title.trim().slice(0, 120)
          : undefined,

      level:
        typeof body.level === "string"
          ? body.level.trim()
          : undefined,

      status:
        typeof body.status === "string"
          ? body.status
          : undefined,

      dataJson:
        body.data !== undefined
          ? JSON.stringify(body.data)
          : undefined,

      updatedAt: new Date().toISOString(),
    })
    .where(eq(curriculumDrafts.id, id))
    .returning();

  if (!updated) {
    return Response.json(
      { error: "Content not found." },
      { status: 404 },
    );
  }

  return Response.json({ content: updated });
}

export async function DELETE(
  _request: Request,
  context: Context,
) {
  const admin = await getSessionAdult();

  if (!admin) {
    return Response.json(
      { error: "Sign in required." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  const db = await getDb();

  const [deleted] = await db
    .delete(curriculumDrafts)
    .where(eq(curriculumDrafts.id, id))
    .returning();

  if (!deleted) {
    return Response.json(
      { error: "Content not found." },
      { status: 404 },
    );
  }

  return Response.json({ ok: true });
}
