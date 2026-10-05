import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'r') as f:
    content = f.read()

# Replace the authorization URL to include the scopes from their screenshot
content = content.replace(
    'authorization: "https://auth.hackclub.com/oauth/authorize",',
    'authorization: "https://auth.hackclub.com/oauth/authorize?scope=openid+email+name+profile+verification_status+slack_id",'
)

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'w') as f:
    f.write(content)
