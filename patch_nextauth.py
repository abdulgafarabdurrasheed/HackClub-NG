import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'r') as f:
    content = f.read()

# Comment out the EmailProvider configuration which is causing the fatal crash
content = content.replace(
    '    EmailProvider({',
    '    // EmailProvider({\n    //   server: process.env.EMAIL_SERVER,\n    //   from: process.env.EMAIL_FROM,\n    // }),\n    /* EmailProvider({'
)
content = content.replace(
    '    }),',
    '    }), */'
)

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/api/auth/[...nextauth]/route.ts', 'w') as f:
    f.write(content)
