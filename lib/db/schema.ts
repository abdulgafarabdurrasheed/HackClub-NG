import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const outreachRoleEnum = pgEnum("outreach_role", [
  "super_admin",
  "coordinator",
  "volunteer",
]);
export const outreachAccountStatusEnum = pgEnum("outreach_account_status", [
  "pending",
  "approved",
  "rejected",
]);
export const schoolStatusEnum = pgEnum("outreach_school_status", [
  "to_research",
  "ready_to_visit",
  "contacted",
  "visited",
  "onboarded",
  "blocked",
  "not_now",
]);
export const recommendationStatusEnum = pgEnum("school_recommendation_status", [
  "new",
  "reviewing",
  "contacted",
  "converted",
  "closed",
]);
export const activityKindEnum = pgEnum("outreach_activity_kind", [
  "visit",
  "call",
  "message",
  "event",
  "follow_up",
  "note",
]);

export const outreachUsers = pgTable(
  "outreach_users",
  {
    email: text("email").primaryKey(),
    username: text("username"),
    passwordHash: text("password_hash"),
    name: text("name").notNull(),
    role: outreachRoleEnum("role").default("volunteer").notNull(),
    approvalStatus: outreachAccountStatusEnum("approval_status").default("approved").notNull(),
    state: text("state"),
    isActive: boolean("is_active").default(true).notNull(),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("outreach_users_username_unique_idx").on(table.username),
    index("outreach_users_approval_status_idx").on(table.approvalStatus, table.createdAt),
  ],
);

export const schools = pgTable("outreach_schools", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  schoolType: text("school_type").default("secondary").notNull(),
  status: schoolStatusEnum("status").default("to_research").notNull(),
  leadSource: text("lead_source").default("team research").notNull(),
  barrier: text("barrier"),
  resourceNotes: text("resource_notes"),
  nextStep: text("next_step"),
  nextStepAt: timestamp("next_step_at", { withTimezone: true }),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  assignedEmail: text("assigned_email"),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const schoolRecommendations = pgTable("school_recommendations", {
  id: uuid("id").defaultRandom().primaryKey(),
  schoolName: text("school_name").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  schoolType: text("school_type").default("secondary").notNull(),
  recommenderRole: text("recommender_role").notNull(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  why: text("why").notNull(),
  wantsVisit: boolean("wants_visit").default(false).notNull(),
  consentToContact: boolean("consent_to_contact").default(false).notNull(),
  status: recommendationStatusEnum("status").default("new").notNull(),
  schoolId: uuid("school_id").references(() => schools.id, { onDelete: "set null" }),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const outreachActivities = pgTable("outreach_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  schoolId: uuid("school_id").references(() => schools.id, { onDelete: "cascade" }),
  actorEmail: text("actor_email").notNull(),
  attendees: text("attendees"),
  kind: activityKindEnum("kind").notNull(),
  summary: text("summary").notNull(),
  happenedAt: timestamp("happened_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
