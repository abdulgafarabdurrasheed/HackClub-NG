"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { outreachActivities, outreachUsers, schoolRecommendations, schools } from "@/lib/db/schema";
import { nigeriaStates } from "@/lib/nigeria-states";
import { sendAccountEmailUpdate } from "@/lib/outreach-email";
import { requireOutreachAccess } from "@/lib/outreach-access";

const schoolStatuses = [
  "to_research",
  "ready_to_visit",
  "contacted",
  "visited",
  "onboarded",
  "blocked",
  "not_now",
] as const;
const recommendationStatuses = ["new", "reviewing", "contacted", "converted", "closed"] as const;
const activityKinds = ["visit", "call", "message", "event", "follow_up", "note"] as const;
const roles = ["volunteer", "coordinator"] as const;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireDb() {
  if (!db) throw new Error("The outreach database is not configured.");
  return db;
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createSchool(formData: FormData) {
  const access = await requireOutreachAccess();
  const database = requireDb();
  const name = text(formData, "name");
  const state = text(formData, "state");
  const city = text(formData, "city");
  const source = text(formData, "leadSource") || "team research";
  if (
    name.length < 3 ||
    name.length > 160 ||
    !nigeriaStates.includes(state as (typeof nigeriaStates)[number]) ||
    city.length < 2 ||
    city.length > 120 ||
    source.length > 160
  ) {
    redirect("/account/schools?error=details");
  }
  await database
    .insert(schools)
    .values({ name, state, city, leadSource: source, createdBy: access.email });
  revalidatePath("/account/schools");
  revalidatePath("/account");
  redirect("/account/schools?added=1");
}

export async function updateSchool(id: string, formData: FormData) {
  await requireOutreachAccess();
  const database = requireDb();
  const status = text(formData, "status");
  const barrier = status === "onboarded" ? "" : text(formData, "barrier");
  const resourceNotes = text(formData, "resourceNotes");
  const nextStep = text(formData, "nextStep");
  const nextStepAtRaw = text(formData, "nextStepAt");
  const assignedEmail = text(formData, "assignedEmail").toLowerCase();
  const nextStepAt = nextStepAtRaw ? new Date(`${nextStepAtRaw}T12:00:00+01:00`) : null;
  if (
    !/^[0-9a-f-]{36}$/i.test(id) ||
    !schoolStatuses.includes(status as (typeof schoolStatuses)[number]) ||
    barrier.length > 1200 ||
    resourceNotes.length > 1200 ||
    nextStep.length > 500 ||
    (nextStepAt && Number.isNaN(nextStepAt.getTime()))
  )
    redirect(`/account/schools/${id}?error=details`);
  if (assignedEmail && !emailPattern.test(assignedEmail))
    redirect(`/account/schools/${id}?error=details`);
  if (assignedEmail) {
    const [assignee] = await database
      .select({
        email: outreachUsers.email,
        isActive: outreachUsers.isActive,
        approvalStatus: outreachUsers.approvalStatus,
      })
      .from(outreachUsers)
      .where(eq(outreachUsers.email, assignedEmail))
      .limit(1);
    if (!assignee || !assignee.isActive || assignee.approvalStatus !== "approved") {
      redirect(`/account/schools/${id}?error=assignee`);
    }
  }
  await database
    .update(schools)
    .set({
      status: status as (typeof schoolStatuses)[number],
      barrier: barrier || null,
      resourceNotes: resourceNotes || null,
      nextStep: nextStep || null,
      nextStepAt,
      assignedEmail: assignedEmail || null,
      updatedAt: new Date(),
    })
    .where(eq(schools.id, id));
  revalidatePath("/account/schools");
  revalidatePath(`/account/schools/${id}`);
  revalidatePath("/account");
  redirect(`/account/schools/${id}?saved=1`);
}

export async function logSchoolActivity(id: string, formData: FormData) {
  const access = await requireOutreachAccess();
  const database = requireDb();
  const kind = text(formData, "kind");
  const summary = text(formData, "summary");
  const attendees = text(formData, "attendees");
  const happenedAtRaw = text(formData, "happenedAt");
  const localDateTime = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::(\d{2}))?$/.exec(happenedAtRaw);
  const happenedAt = localDateTime
    ? new Date(`${localDateTime[1]}:${localDateTime[2] ?? "00"}+01:00`)
    : happenedAtRaw
      ? new Date(Number.NaN)
      : new Date();
  if (
    !/^[0-9a-f-]{36}$/i.test(id) ||
    !activityKinds.includes(kind as (typeof activityKinds)[number]) ||
    summary.length < 3 ||
    summary.length > 1200 ||
    attendees.length > 500 ||
    Number.isNaN(happenedAt.getTime())
  )
    redirect(`/account/schools/${id}?error=activity`);
  const [school] = await database
    .select({ id: schools.id })
    .from(schools)
    .where(eq(schools.id, id))
    .limit(1);
  if (!school) redirect("/account/schools?error=missing");
  await database.insert(outreachActivities).values({
    schoolId: id,
    actorEmail: access.email,
    attendees: attendees || null,
    kind: kind as (typeof activityKinds)[number],
    summary,
    happenedAt,
  });
  if (kind === "visit")
    await database
      .update(schools)
      .set({ status: "visited", updatedAt: new Date() })
      .where(eq(schools.id, id));
  revalidatePath(`/account/schools/${id}`);
  revalidatePath("/account");
  redirect(`/account/schools/${id}?activity=1`);
}

export async function setRecommendationStatus(id: string, formData: FormData) {
  await requireOutreachAccess();
  const database = requireDb();
  const status = text(formData, "status");
  if (
    !/^[0-9a-f-]{36}$/i.test(id) ||
    !recommendationStatuses.includes(status as (typeof recommendationStatuses)[number])
  )
    redirect("/account/recommendations?error=details");
  await database
    .update(schoolRecommendations)
    .set({ status: status as (typeof recommendationStatuses)[number], updatedAt: new Date() })
    .where(eq(schoolRecommendations.id, id));
  revalidatePath("/account/recommendations");
  revalidatePath("/account");
}

export async function convertRecommendationToSchool(id: string) {
  const access = await requireOutreachAccess();
  const database = requireDb();
  if (!/^[0-9a-f-]{36}$/i.test(id)) redirect("/account/recommendations?error=details");
  await database.transaction(async (tx) => {
    const [recommendation] = await tx
      .select()
      .from(schoolRecommendations)
      .where(eq(schoolRecommendations.id, id))
      .limit(1);
    if (!recommendation || recommendation.status === "converted") return;
    const [school] = await tx
      .insert(schools)
      .values({
        name: recommendation.schoolName,
        state: recommendation.state,
        city: recommendation.city,
        schoolType: recommendation.schoolType,
        status: "ready_to_visit",
        leadSource: "public recommendation",
        contactName: recommendation.contactName,
        contactEmail: recommendation.contactEmail,
        createdBy: access.email,
      })
      .returning({ id: schools.id });
    await tx
      .update(schoolRecommendations)
      .set({ status: "converted", schoolId: school.id, updatedAt: new Date() })
      .where(eq(schoolRecommendations.id, id));
  });
  revalidatePath("/account/recommendations");
  revalidatePath("/account/schools");
  revalidatePath("/account");
  redirect("/account/recommendations?converted=1");
}

export async function reviewOutreachAccount(emailRaw: string, formData: FormData) {
  const access = await requireOutreachAccess();
  if (access.role !== "super_admin") redirect("/account/team?error=permission");
  const database = requireDb();
  const email = emailRaw.trim().toLowerCase();
  const decision = text(formData, "decision");
  if (!emailPattern.test(email) || !["approved", "rejected"].includes(decision))
    redirect("/account/team?error=review");
  const [account] = await database
    .select({ email: outreachUsers.email, name: outreachUsers.name, status: outreachUsers.approvalStatus })
    .from(outreachUsers)
    .where(eq(outreachUsers.email, email))
    .limit(1);
  if (!account || account.status !== "pending") redirect("/account/team?error=review");

  await database
    .update(outreachUsers)
    .set({
      approvalStatus: decision as "approved" | "rejected",
      isActive: decision === "approved",
      reviewedBy: access.email,
      reviewedAt: new Date(),
    })
    .where(eq(outreachUsers.email, email));
  const emailResult = await sendAccountEmailUpdate(
    account.email,
    account.name,
    decision as "approved" | "rejected",
  );
  revalidatePath("/account/team");
  revalidatePath("/account");
  redirect(`/account/team?reviewed=${decision}&email=${emailResult}`);
}

export async function updateTeamRole(emailRaw: string, formData: FormData) {
  const access = await requireOutreachAccess();
  if (access.role !== "super_admin") redirect("/account/team?error=permission");
  const database = requireDb();
  const email = emailRaw.trim().toLowerCase();
  const role = text(formData, "role");
  if (
    !emailPattern.test(email) ||
    email === access.email ||
    !roles.includes(role as (typeof roles)[number])
  )
    redirect("/account/team?error=details");
  const [target] = await database
    .select({ role: outreachUsers.role })
    .from(outreachUsers)
    .where(eq(outreachUsers.email, email))
    .limit(1);
  if (!target || target.role === "super_admin") redirect("/account/team?error=details");
  await database
    .update(outreachUsers)
    .set({ role: role as (typeof roles)[number] })
    .where(
      and(
        eq(outreachUsers.email, email),
        eq(outreachUsers.isActive, true),
        eq(outreachUsers.approvalStatus, "approved"),
      ),
    );
  revalidatePath("/account/team");
}

export async function setTeamMemberActive(emailRaw: string, isActive: boolean) {
  const access = await requireOutreachAccess();
  if (access.role !== "super_admin") redirect("/account/team?error=permission");
  const database = requireDb();
  const email = emailRaw.trim().toLowerCase();
  if (!emailPattern.test(email) || typeof isActive !== "boolean" || email === access.email) {
    redirect("/account/team?error=details");
  }
  const [target] = await database
    .select({ role: outreachUsers.role, approvalStatus: outreachUsers.approvalStatus })
    .from(outreachUsers)
    .where(eq(outreachUsers.email, email))
    .limit(1);
  if (!target || target.role === "super_admin" || target.approvalStatus !== "approved") {
    redirect("/account/team?error=details");
  }
  await database.update(outreachUsers).set({ isActive }).where(eq(outreachUsers.email, email));
  revalidatePath("/account/team");
}
