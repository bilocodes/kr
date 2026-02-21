// User store – keep this file server-side only.
// Passwords are bcrypt hashes generated with bcryptjs (saltRounds = 12).
// To add / remove users, edit the `users` array below (max 30).
// Generate a hash:  node -e "const b=require('bcryptjs');b.hash('mypassword',12).then(console.log)"

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "member";
}

// ⚠️  Replace the hashes below with real bcrypt hashes before deploying.
//     The placeholder hash corresponds to the string "changeme".
const PLACEHOLDER_HASH =
  "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewNgXG8PEVjNf5Di";

export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    passwordHash: PLACEHOLDER_HASH,
    role: "admin",
  },
  // Add up to 29 more users here following the same pattern.
  // e.g.
  // {
  //   id: "2",
  //   name: "Team Member",
  //   email: "member@example.com",
  //   passwordHash: "<bcrypt hash>",
  //   role: "member",
  // },
];

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
