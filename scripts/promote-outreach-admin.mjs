import nextEnv from "@next/env";
import postgres from "postgres";

nextEnv.loadEnvConfig(process.cwd());

const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: npm run account:promote-admin -- you@example.com");
  process.exit(1);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is missing. Add it to .env.local first.");
  process.exit(1);
}

const sql = postgres(connectionString, { prepare: false, max: 1 });

try {
  const rows = await sql`
    update outreach_users
    set role = 'super_admin',
        approval_status = 'approved',
        is_active = true,
        reviewed_by = ${email},
        reviewed_at = now()
    where email = ${email}
    returning email, username, name, role, approval_status, is_active
  `;

  if (rows.length === 0) {
    console.error(`No outreach account found for ${email}. Register first at /account/register.`);
    process.exitCode = 1;
  } else {
    console.log("Promoted account:");
    console.table(rows);
  }
} catch (error) {
  console.error("Could not promote account. Check DATABASE_URL and confirm the outreach migrations ran.");
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await sql.end();
}
