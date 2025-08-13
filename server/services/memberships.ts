import { and, eq } from 'drizzle-orm';
import {
  users,
  servers,
  userServerMemberships,
  userTeamMemberships,
  teams,
} from '../../drizzle/schema';
import { db } from 'server/api/memberships';
import type { MembershipsByServer } from 'server/types/membership';

const userColors: Record<string, string> = {
  '1': 'purple',
  '2': 'red',
  '3': 'blue',
  '4': 'green',
  '5': 'orange',
  '6': 'teal',
  '7': 'pink',
  '8': 'yellow',
  '9': 'lime',
  '0': 'teal',
};

export function getUserColor(userId: number | string): string {
  const lastDigit = String(userId).slice(-1);
  return userColors[lastDigit] ?? 'white'; // fallback if not matched
}

export async function getUserMemberships(userId: number): Promise<MembershipsByServer> {
  const rows = await db
    .select({
      user: {
        id: users.id,
        username: users.username,
        createdAt: users.createdAt,
      },
      server: {
        id: servers.id,
        name: servers.name,
      },
      membership: {
        id: userServerMemberships.id,
        userId: userServerMemberships.userId,
        serverId: userServerMemberships.serverId,
        joinedAt: userServerMemberships.joinedAt,
      },
      userTeamMemberships: {
        teamId: userTeamMemberships.teamId,
        serverId: userTeamMemberships.serverId,
        joinedAt: userTeamMemberships.joinedAt,
      },
      team: {
        id: teams.id,
        name: teams.name,
      },
    })
    .from(userServerMemberships)
    .innerJoin(users, eq(users.id, userServerMemberships.userId))
    .innerJoin(servers, eq(servers.id, userServerMemberships.serverId))
    .leftJoin(
      userTeamMemberships,
      and(eq(userTeamMemberships.userId, users.id), eq(userTeamMemberships.serverId, servers.id))
    )
    .leftJoin(teams, eq(teams.id, userTeamMemberships.teamId))
    .where(eq(userServerMemberships.userId, userId));

  if (rows.length === 0) {
    return {
      users: { id: userId, username: '', createdAt: '', style: getUserColor(userId) },
      servers: {},
    };
  }

  const result: MembershipsByServer = {
    users: { ...rows[0].user, style: getUserColor(userId) },
    servers: {},
  };

  for (const r of rows) {
    const sid = r.server.id;

    // Ensure server bucket
    if (!result.servers[sid]) {
      result.servers[sid] = {
        id: r.membership.id,
        userId: r.membership.userId,
        serverId: r.membership.serverId,
        joinedAt: r.membership.joinedAt,
        name: r.server.name,
        teams: {},
      };
    }

    // Attach team only if present (left join => may be null)
    if (r.team && r.team.id != null) {
      if (!result.servers[sid].teams) {
        result.servers[sid].teams = {};
      }
      result.servers[sid].teams[r.team.id] = {
        id: r.team.id,
        name: r.team.name!,
        joinedAt: r.userTeamMemberships?.joinedAt ?? '', // or make this optional in the type
      };
    }
  }

  return result;
}
