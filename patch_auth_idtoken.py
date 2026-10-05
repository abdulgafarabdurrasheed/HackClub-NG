import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'r') as f:
    content = f.read()

# Add idToken flag to provider
if 'idToken: true' not in content:
    content = content.replace('type: "oauth" as const,', 'type: "oauth" as const,\n  idToken: true,')

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'w') as f:
    f.write(content)
