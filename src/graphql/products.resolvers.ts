import type { User, PrismaClient } from '@prisma/client';

interface ResolverContext {
	orm: PrismaClient;
}

export async function findAll(
	parent: unknown,
	arg: unknown,
	context: ResolverContext
): Promise<User[]> {
	return await context.orm.user.findMany();
}

// export const resolver: Record<keyof User, (parent: User) => unknown> = {
// 	id: (parent) => parent.id,
// 	email: (parent) => parent.email,
// 	firstName: (parent) => parent.firstName,
// 	lastName: (parent) => parent.lastName,
// 	password: (parent) => parent.password,
// 	roles: (parent) => parent.roles,
// 	createdAt: (parent) => parent.id,
// 	updatedAt: (parent) => parent.id,
// };
