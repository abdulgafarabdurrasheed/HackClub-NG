import re

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/[locale]/page.tsx', 'r') as f:
    content = f.read()

target_block = """            <p className={styles["clubs-hero-copy"]}>{t("heroCopy")}</p>"""

new_block = """            <p className={styles["clubs-hero-copy"]}>{t("heroCopy")}</p>
            <p style={{
              maxWidth: "630px",
              margin: "20px auto 0",
              fontSize: "14px",
              color: "var(--muted)",
              backgroundColor: "var(--darker)",
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid var(--sunken)",
              lineHeight: "1.4"
            }}>
              {t("affiliationDisclaimer")}
            </p>"""

content = content.replace(target_block, new_block)

with open('/Users/h.i.m/Desktop/nigeria-hackclub-site/app/[locale]/page.tsx', 'w') as f:
    f.write(content)
