import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/components/Footer.tsx', 'r') as f:
    content = f.read()

# We want to replace the copyright <p> block
regex = r'\{t\("copyright".*?hackclub/site\n\s*</a>'
replacement = """© {year} Hack Club Nigeria. Open source at{" "}
          <a
            href="https://github.com/hackclub/nigeria-hackclub-site"
            target="_blank"
            rel="noopener noreferrer"
            style={u}
          >
            hackclub/nigeria-hackclub-site
          </a>"""

new_content = re.sub(regex, replacement, content, flags=re.DOTALL)

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/components/Footer.tsx', 'w') as f:
    f.write(new_content)

