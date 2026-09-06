import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { curriculumDrafts } from "@/db/schema";
import { requireAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  await requireAdult("/admin/content");

  const db = await getDb();

  const content = await db
    .select()
    .from(curriculumDrafts)
    .orderBy(desc(curriculumDrafts.updatedAt));

  return (
    <main style={{ padding: 30 }}>
      <h1>Content Management</h1>

      <Link href="/admin/content/new">
        Add Educational Content
      </Link>

      <table
        style={{
          width: "100%",
          marginTop: 20,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Level</th>
            <th>Status</th>
            <th>Updated</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {content.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.level}</td>
              <td>{item.status}</td>
              <td>{item.updatedAt}</td>

              <td>
                <Link href={`/admin/content/${item.id}`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
