import { getDb } from "@/db";
import { adults, classes } from "@/db/schema";
import { requireAdult } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireAdult("/admin/users");

  const db = await getDb();

  const users = await db
    .select({
      id: adults.id,
      name: adults.displayName,
      email: adults.email,
      createdAt: adults.createdAt,
    })
    .from(adults);

  const teacherClasses = await db.select().from(classes);

  return (
    <main style={{ padding: 30 }}>
      <h1>User Management</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 20,
        }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Classes</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const totalClasses = teacherClasses.filter(
              (item) => item.teacherId === user.id,
            ).length;

            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{totalClasses}</td>
                <td>{user.createdAt}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
