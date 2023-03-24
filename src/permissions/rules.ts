import { rule } from 'graphql-shield';
import type { User, PrismaClient } from '@prisma/client';
import { UserRole } from '@prisma/client';

export interface ResolverContext {
	orm: PrismaClient;
	user: User;
}

export const isAuthenticated = rule({ cache: 'contextual' })(
	async (parent, args, ctx: ResolverContext, info): Promise<any> => {
		return ctx.user!==null ;
	}
);

export const isClient = rule({ cache: 'contextual' })(
	async (parent, args, ctx: ResolverContext, info): Promise<any> => {
		return ctx.user.roles.includes(UserRole.CLIENT);
	}
);

export const isManager = rule({ cache: 'contextual' })(
	async (parent, args, ctx: ResolverContext, info): Promise<any> => {
		return ctx.user.roles.includes(UserRole.MANAGER);
	}
);
