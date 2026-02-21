import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { users } from "@/lib/users";

export default async function AdminPage() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "admin") redirect("/dashboard");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">User Administration</h1>
        <p className="mt-1 text-slate-500">
          This hub supports up to 30 users. Edit{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700">
            src/lib/users.ts
          </code>{" "}
          to add or remove team members.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-medium text-slate-700">
            {users.length} / 30 seats used
          </p>
          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${(users.length / 30) * 100}%` }}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Name</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {user.name}
                </td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>How to add users:</strong> Open{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">
          src/lib/users.ts
        </code>{" "}
        and append entries to the <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">users</code> array. Generate a
        bcrypt hash for each password with:{" "}
        <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">
          node -e &quot;const b=require(&apos;bcryptjs&apos;);b.hash(&apos;yourpassword&apos;,12).then(console.log)&quot;
        </code>
      </div>
    </div>
  );
}
