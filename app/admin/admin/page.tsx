import Link from "next/link";
import { getDb } from "@/db";
import {
  adults,
  classes,
  classStudents,
  curriculumDrafts,
  activitySubmissions,
} from "@/db/schema";
import { requireAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireAdult("/admin");
  const db = await getDb();

  const users = await db.select().from(adults);
  const allClasses = await db.select().from(classes);
  const students = await db.select().from(classStudents);
  const content = await db.select().from(curriculumDrafts);
  const results = await db.select().from(activitySubmissions);

  const cards = [
    { title: "Users", value: users.length },
    { title: "Classes", value: allClasses.length },
    { title: "Students", value: students.length },
    { title: "Content", value: content.length },
    { title: "Results", value: results.length },
  ];

  return (
    <main style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.displayName}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginTop: "30px",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.title}
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <h2>{card.title}</h2>
            <strong style={{ fontSize: "30px" }}>{card.value}</strong>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "40px", display: "grid", gap: "12px" }}>
        <Link href="/admin/users">Manage Users</Link>
        <Link href="/admin/content">Manage Educational Content</Link>
        <Link href="/admin/results">Manage Grades / Results</Link>
      </div>
    </main>
  );
}
