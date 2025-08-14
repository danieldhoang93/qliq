// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import fs from 'node:fs';
import path from 'node:path';
console.log({
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: {
      ca: fs.readFileSync(path.resolve('./server/db/rds-us-west-2-bundle.pem')).toString(),
    },
  },
});
export default defineConfig({
  out: 'drizzle',
  dialect: 'postgresql',
  schema: [],
  // no `driver` here for standard Postgres connections
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: {
      ca: fs.readFileSync(path.resolve('./server/db/rds-us-west-2-bundle.pem')).toString(),
      rejectUnauthorized: true,
    },
  },
  // optional extras if you want them:
  // schemaFilter: "public",
  // tablesFilter: "*",
  // migrations: { prefix: "timestamp", table: "__drizzle_migrations__", schema: "public" },
  // strict: true,
  // verbose: true,
});
