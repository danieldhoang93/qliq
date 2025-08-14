import { pgTable, unique, serial, text, timestamp, index, foreignKey, integer, bigserial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	username: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_username_key").on(table.username),
]);

export const servers = pgTable("servers", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
});

export const teams = pgTable("teams", {
	id: serial().primaryKey().notNull(),
	serverId: integer("server_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_teams_server_id").using("btree", table.serverId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.serverId],
			foreignColumns: [servers.id],
			name: "teams_server_id_fkey"
		}).onDelete("cascade"),
	unique("teams_server_id_name_key").on(table.serverId, table.name),
]);

export const userServerMemberships = pgTable("user_server_memberships", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	serverId: integer("server_id").notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_usm_server_id").using("btree", table.serverId.asc().nullsLast().op("int4_ops")),
	index("idx_usm_user_id").using("btree", table.userId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_server_memberships_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.serverId],
			foreignColumns: [servers.id],
			name: "user_server_memberships_server_id_fkey"
		}).onDelete("cascade"),
	unique("user_server_memberships_user_id_server_id_key").on(table.userId, table.serverId),
]);

export const userTeamMemberships = pgTable("user_team_memberships", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	teamId: integer("team_id").notNull(),
	serverId: integer("server_id").notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_utm_team_id").using("btree", table.teamId.asc().nullsLast().op("int4_ops")),
	index("idx_utm_user_server").using("btree", table.userId.asc().nullsLast().op("int4_ops"), table.serverId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_team_memberships_user_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "user_team_memberships_team_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.serverId],
			foreignColumns: [servers.id],
			name: "user_team_memberships_server_id_fkey"
		}).onDelete("cascade"),
	unique("user_team_memberships_user_id_server_id_key").on(table.userId, table.serverId),
]);

export const chatMessages = pgTable("chat_messages", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	serverId: integer("server_id"),
	teamId: integer("team_id"),
	userId: integer("user_id").notNull(),
	message: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_chat_server_created").using("btree", table.serverId.asc().nullsLast().op("int4_ops"), table.createdAt.desc().nullsFirst().op("int4_ops")),
	index("idx_chat_server_created_desc").using("btree", table.serverId.asc().nullsLast().op("int8_ops"), table.createdAt.desc().nullsFirst().op("int8_ops"), table.id.desc().nullsFirst().op("int4_ops")).where(sql`(team_id IS NULL)`),
	index("idx_chat_team_created").using("btree", table.teamId.asc().nullsLast().op("timestamptz_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_chat_team_created_desc").using("btree", table.teamId.asc().nullsLast().op("int4_ops"), table.createdAt.desc().nullsFirst().op("timestamptz_ops"), table.id.desc().nullsFirst().op("int8_ops")).where(sql`(team_id IS NOT NULL)`),
	foreignKey({
			columns: [table.serverId],
			foreignColumns: [servers.id],
			name: "chat_messages_server_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "chat_messages_team_id_fkey"
		}).onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "chat_messages_user_id_fkey"
		}).onDelete("cascade"),
]);
