import { and, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { outreachUsers } from "@/lib/db/schema";

export type OutreachAccess = {
  email: string;
  name: string;
  role: "super_admin" | "coordinator" | "volunteer";
};

export type OutreachDatabaseStatus = "not_configured" | "missing_schema" | "ready";
export type OutreachAccountStatus = "pending" | "approved" | "rejected" | "inactive" | null;

export async function getOutreachDatabaseStatus(): Promise<OutreachDatabaseStatus> {
  if (!db) return "not_configured";
  const [result] = await db.execute(sql`
    select
      to_regclass('outreach_users') as outreach_users_table,
      (
        select count(*) = 3
        from information_schema.columns
        where table_schema = current_schema()
          and table_name = 'outreach_users'
          and column_name in ('username', 'password_hash', 'approval_status')
      ) as account_columns_ready
  `);
  return result?.outreach_users_table && result?.account_columns_ready ? "ready" : "missing_schema";
}

export async function getOutreachAccountStatus(email: string): Promise<OutreachAccountStatus> {
  if (!db) return null;
  const [account] = await db
    .select({ approvalStatus: outreachUsers.approvalStatus, isActive: outreachUsers.isActive })
    .from(outreachUsers)
    .where(eq(outreachUsers.email, email.trim().toLowerCase()))
    .limit(1);
  if (!account) return null;
  if (account.approvalStatus === "rejected") return "rejected";
  if (!account.isActive) return "inactive";
  return account.approvalStatus;
}

export async function getOutreachAccess(): Promise<OutreachAccess | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.trim().toLowerCase();
  if (!email || !session?.user?.outreachAccount) return null;

  if (!db) return null;
  const [member] = await db
    .select()
    .from(outreachUsers)
    .where(
      and(
        eq(outreachUsers.email, email),
        eq(outreachUsers.isActive, true),
        eq(outreachUsers.approvalStatus, "approved"),
      ),
    )
    .limit(1);
  return member ? { email, name: member.name, role: member.role } : null;
}

export async function requireOutreachAccess() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/account/sign-in");
  const databaseStatus = await getOutreachDatabaseStatus();
  if (databaseStatus !== "ready") redirect("/account/sign-in?setup=database");
  const access = await getOutreachAccess();
  if (!access) redirect("/account/sign-in?denied=1");
  return access;
}
