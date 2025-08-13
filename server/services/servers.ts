import { db } from 'server/api/memberships'; // your db instance
import { servers } from '../../drizzle/schema';
import { desc } from 'drizzle-orm';

export async function getAllServers() {
  return await db.select().from(servers).orderBy(desc(servers.id));
}
