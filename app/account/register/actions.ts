"use server";

import { or, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { outreachUsers } from "@/lib/db/schema";
import { sendAccountEmailUpdate } from "@/lib/outreach-email";
import { hashPassword } from "@/lib/password";
import { getOutreachDatabaseStatus } from "@/lib/outreach-access";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-z0-9][a-z0-9._-]{2,29}$/;

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function isUniqueViolation(error: unknown): boolean {
  const seen = new Set<object>();
  let current: unknown = error;
  while (typeof current === "object" && current !== null && !seen.has(current)) {
    seen.add(current);
    if ("code" in current && current.code === "23505") return true;
    current = "cause" in current ? current.cause : undefined;
  }
  return false;
}

export async function registerOutreachAccount(formData: FormData) {
  if (!db || (await getOutreachDatabaseStatus()) !== "ready") {
    redirect("/account/register?error=setup");
  }

  const name = value(formData, "name");
  const username = value(formData, "username").toLowerCase();
  const email = value(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (
    name.length < 2 ||
    name.length > 120 ||
    !usernamePattern.test(username) ||
    email.length > 254 ||
    !emailPattern.test(email) ||
    password.length < 10 ||
    password.length > 128 ||
    password !== confirmation
  ) {
    redirect("/account/register?error=details");
  }

  const [existing] = await db
    .select({ email: outreachUsers.email })
    .from(outreachUsers)
    .where(or(eq(outreachUsers.email, email), eq(outreachUsers.username, username)))
    .limit(1);
  if (existing) redirect("/account/register?error=exists");

  const passwordHash = await hashPassword(password);
  try {
    await db.insert(outreachUsers).values({
      email,
      username,
      passwordHash,
      name,
      role: "volunteer",
      approvalStatus: "pending",
      isActive: true,
    });
  } catch (error) {
    if (isUniqueViolation(error)) redirect("/account/register?error=exists");
    throw error;
  }

  const emailResult = await sendAccountEmailUpdate(email, name, "submitted");
  redirect(`/account/sign-in?registered=1&email=${emailResult}`);
}
