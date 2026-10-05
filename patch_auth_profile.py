import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'r') as f:
    content = f.read()

# Replace the profile function to be extremely defensive
old_profile = """  profile(profile: any) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
    };
  },"""

new_profile = """  profile(profile: any) {
    console.log("Hack Club Auth Profile Payload:", profile);
    return {
      id: profile.slack_id || profile.id || profile.email || String(Math.random()),
      name: profile.name || profile.username || "Hack Club Member",
      email: profile.email || "unknown@hackclub.com",
    };
  },"""

content = content.replace(old_profile, new_profile)

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'w') as f:
    f.write(content)
