import re

with open('lib/db/schema.ts', 'r') as f:
    content = f.read()

# Add real (float) to imports
content = content.replace('pgEnum } from "drizzle-orm/pg-core";', 'pgEnum, real } from "drizzle-orm/pg-core";')

# Add address, lat, lng to clubs
replacement = """  state: text("state").notNull(),
  city: text("city").notNull(),
  address: text("address"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  bio: text("bio"),"""

content = content.replace("""  state: text("state").notNull(),
  city: text("city").notNull(),
  bio: text("bio"),""", replacement)

with open('lib/db/schema.ts', 'w') as f:
    f.write(content)
