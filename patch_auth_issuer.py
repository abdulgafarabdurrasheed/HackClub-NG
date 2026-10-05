import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'r') as f:
    content = f.read()

# Add issuer to the provider config
if 'issuer: "https://auth.hackclub.com"' not in content:
    content = content.replace(
        'type: "oauth" as const,',
        'type: "oauth" as const,\n  issuer: "https://auth.hackclub.com",'
    )

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'w') as f:
    f.write(content)
