import { InferSelectModel } from 'drizzle-orm';
import { teams } from '../../drizzle/schema';

// Type from your actual table shape:
export type Team = InferSelectModel<typeof teams>;
