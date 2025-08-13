import { InferSelectModel } from 'drizzle-orm';
import { users } from '../../drizzle/schema';
import { Membership } from './membership';

// TODO: remove style once in db
export type User = InferSelectModel<typeof users> & {
  style?: string;
};

export type UserMembershipRow = {
  users: User;
  userServerMemberships: Membership;
};

export type MembershipsResponseItem = {
  users: User;
  userServerMemberships: Array<Membership>;
};
