import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/[locale]/page.tsx', 'r') as f:
    content = f.read()

# We want to add a secondary button next to the primary apply button.
# Let's find the primary button block and append the new button.
target_block = """              <a
                className={`${styles["clubs-button"]} ${styles["clubs-button-red"]} cta-btn`}
                href="https://apply.hackclub.com"
                target="_blank"
                rel="noreferrer"
              >
                {t("startClub")} <Arrow />
              </a>"""

new_button = """              <Link
                className={`${styles["clubs-button"]} ${styles["clubs-button-white"]} cta-btn`}
                href="/register"
              >
                Add to Directory <Arrow />
              </Link>"""

content = content.replace(target_block, target_block + "\n" + new_button)

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/[locale]/page.tsx', 'w') as f:
    f.write(content)

