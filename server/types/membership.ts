import { InferSelectModel } from 'drizzle-orm';
import { userServerMemberships, userTeamMemberships } from '../../drizzle/schema';
import { User } from './user';
import { Team } from './teams';

// Type from your actual table shape:
export type Membership = InferSelectModel<typeof userServerMemberships>;

export type UserTeamMembership = InferSelectModel<typeof userTeamMemberships>;

export type MembershipsByServer = {
  users: User;
  servers: Record<
    number,
    {
      // flatten the membership fields at the server level like your example
      id: Membership['id'];
      userId: Membership['userId'];
      serverId: Membership['serverId'];
      joinedAt: Membership['joinedAt'];
      // (optional) include server name if you want
      name?: string;
      teams?: Record<
        number,
        {
          id: Team['id'];
          name: Team['name'];
          // joinedAt from user_team_memberships for this user on that team
          joinedAt: UserTeamMembership['joinedAt'];
        }
      >;
    }
  >;
};
