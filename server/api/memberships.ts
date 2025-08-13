import express from 'express';
import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../drizzle/schema';
import { getUserMemberships } from 'server/services/memberships';
import 'dotenv/config';

console.log({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // no URL encoding issues
  database: process.env.DB_NAME,
  //   ssl: process.env.PGSSLROOTCERT,
});

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, // no URL encoding issues
  database: process.env.DB_NAME,
  ssl: process.env.PGSSLROOTCERT
    ? { ca: fs.readFileSync(process.env.PGSSLROOTCERT, 'utf8') }
    : { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

export const membershipsRouter = express.Router();

// membershipsRouter.get('/memberships/:userId', async (req, res) => {
//   const userId = parseInt(req.params.userId, 10);
//   console.log('/memberships/:userId', userId);

//   if (isNaN(userId)) {
//     return res.status(400).json({ error: 'Invalid userId' });
//   }

//   try {
//     const rows = await getUserMemberships(userId);
//     console.log({ rows });
//     res.json(rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Database error' });
//   }
// });
