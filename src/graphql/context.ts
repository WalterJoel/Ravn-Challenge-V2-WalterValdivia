import { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';

export const prisma = new PrismaClient();

export interface ResolverContext {
	orm: PrismaClient;
	user: User;
}
