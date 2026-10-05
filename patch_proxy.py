import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/proxy.ts', 'r') as f:
    content = f.read()

# Add getToken import
if 'import { getToken }' not in content:
    content = 'import { getToken } from "next-auth/jwt";\n' + content

# Make proxy async
content = content.replace('export default function proxy(request: NextRequest) {', 'export default async function proxy(request: NextRequest) {')

# Add auth check logic
auth_logic = """
  // NextAuth Protection
  const isProtected = pathname.includes("/directory") || pathname.includes("/register") || pathname.includes("/admin") || pathname.includes("/dashboard");
  
  if (isProtected) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const localeMatch = pathname.match(/^\\/([a-z]{2})\\//);
      const locale = localeMatch ? localeMatch[1] : "en";
      return NextResponse.redirect(new URL(`/${locale}/auth`, request.url));
    }
  }
"""

# Insert auth logic at the beginning of the proxy function body
content = content.replace(
    '  const { pathname, search } = request.nextUrl;',
    '  const { pathname, search } = request.nextUrl;\n' + auth_logic
)

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/proxy.ts', 'w') as f:
    f.write(content)
