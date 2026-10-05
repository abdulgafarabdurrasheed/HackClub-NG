import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/components/Navbar.tsx', 'r') as f:
    content = f.read()

regex = r'const links: Array<\{ label: string; href\?: string; dropdown\?: Item\[\] \}> = \[.*?\];'

replacement = """const links: Array<{ label: string; href?: string; dropdown?: Item[] }> = [
    { label: "Home", href: "/" },
    { label: "Directory", href: "/directory" },
    { label: "Register Club", href: "/register" }
  ];"""

new_content = re.sub(regex, replacement, content, flags=re.DOTALL)

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/components/Navbar.tsx', 'w') as f:
    f.write(new_content)

