// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './server/db/schema.ts',
  // no `driver` here for standard Postgres connections
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // optional extras if you want them:
  // schemaFilter: "public",
  // tablesFilter: "*",
  // migrations: { prefix: "timestamp", table: "__drizzle_migrations__", schema: "public" },
  // strict: true,
  // verbose: true,
});
