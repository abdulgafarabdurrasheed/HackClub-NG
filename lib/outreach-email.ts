export type OutreachEmailResult = "sent" | "not_configured" | "failed";
export type AccountEmailUpdate = "submitted" | "approved" | "rejected";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function sendAccountEmailUpdate(
  email: string,
  name: string,
  update: AccountEmailUpdate,
): Promise<OutreachEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.OUTREACH_FROM_EMAIL;
  if (!apiKey || !from) return "not_configured";

  const messages: Record<AccountEmailUpdate, { subject: string; body: string }> = {
    submitted: {
      subject: "Your Nigeria outreach account is awaiting review",
      body: "We received your request. A Nigeria outreach admin will review it and email you with an update.",
    },
    approved: {
      subject: "Your Nigeria outreach account is approved",
      body: "An admin approved your account. You can now sign in and help coordinate school outreach.",
    },
    rejected: {
      subject: "An update about your Nigeria outreach account",
      body: "An admin could not approve your account at this time. If you think this is a mistake, reply to this email.",
    },
  };
  const message = messages[update];
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "")
    .replace(/\/$/, "");
  const signInUrl = `${siteUrl}/account/sign-in`;
  const safeName = escapeHtml(name);
  const safeBody = escapeHtml(message.body);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: message.subject,
        html: `<p>Hi ${safeName},</p><p>${safeBody}</p><p><a href="${escapeHtml(signInUrl)}">Open the outreach workspace</a></p><p>This workspace supports teen-led Hack Club activity in Nigeria. Official club rules and applications remain with <a href="https://hackclub.com/">Hack Club Global</a>.</p>`,
      }),
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
