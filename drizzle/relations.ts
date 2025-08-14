import { relations } from "drizzle-orm/relations";
import { servers, teams, users, userServerMemberships, userTeamMemberships, chatMessages } from "./schema";

export const teamsRelations = relations(teams, ({one, many}) => ({
	server: one(servers, {
		fields: [teams.serverId],
		references: [servers.id]
	}),
	userTeamMemberships: many(userTeamMemberships),
	chatMessages: many(chatMessages),
}));

export const serversRelations = relations(servers, ({many}) => ({
	teams: many(teams),
	userServerMemberships: many(userServerMemberships),
	userTeamMemberships: many(userTeamMemberships),
	chatMessages: many(chatMessages),
}));

export const userServerMembershipsRelations = relations(userServerMemberships, ({one}) => ({
	user: one(users, {
		fields: [userServerMemberships.userId],
		references: [users.id]
	}),
	server: one(servers, {
		fields: [userServerMemberships.serverId],
		references: [servers.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	userServerMemberships: many(userServerMemberships),
	userTeamMemberships: many(userTeamMemberships),
	chatMessages: many(chatMessages),
}));

export const userTeamMembershipsRelations = relations(userTeamMemberships, ({one}) => ({
	user: one(users, {
		fields: [userTeamMemberships.userId],
		references: [users.id]
	}),
	team: one(teams, {
		fields: [userTeamMemberships.teamId],
		references: [teams.id]
	}),
	server: one(servers, {
		fields: [userTeamMemberships.serverId],
		references: [servers.id]
	}),
}));

export const chatMessagesRelations = relations(chatMessages, ({one}) => ({
	server: one(servers, {
		fields: [chatMessages.serverId],
		references: [servers.id]
	}),
	team: one(teams, {
		fields: [chatMessages.teamId],
		references: [teams.id]
	}),
	user: one(users, {
		fields: [chatMessages.userId],
		references: [users.id]
	}),
}));