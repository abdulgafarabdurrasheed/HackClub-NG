import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'r') as f:
    content = f.read()

# Replace the entire HackClubProvider configuration
old_provider_match = re.search(r'const HackClubProvider = \{.*?\n\};\n', content, re.DOTALL)

new_provider = """const HackClubProvider = {
  id: "hackclub",
  name: "Hack Club",
  type: "oauth" as const,
  wellKnown: "https://auth.hackclub.com/.well-known/openid-configuration",
  clientId: process.env.HACKCLUB_CLIENT_ID || "mock-client-id",
  clientSecret: process.env.HACKCLUB_CLIENT_SECRET || "mock-secret",
  authorization: {
    params: { scope: "openid email name profile verification_status slack_id" },
  },
  profile(profile: any) {
    console.log("Hack Club Auth Profile Payload:", profile);
    return {
      id: profile.slack_id || profile.sub || profile.id || profile.email || String(Math.random()),
      name: profile.name || profile.username || "Hack Club Member",
      email: profile.email || "unknown@hackclub.com",
    };
  },
};
"""

if old_provider_match:
    content = content.replace(old_provider_match.group(0), new_provider)
else:
    print("Could not find HackClubProvider block to replace")

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'w') as f:
    f.write(content)
