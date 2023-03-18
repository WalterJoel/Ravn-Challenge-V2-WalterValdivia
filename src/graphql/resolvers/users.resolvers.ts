import type { User, PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

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

export async function createUser(
	parent: unknown,
	// Recojo de User el firstname email y password
	{ createUserDto }: { createUserDto: User },
	// {createUserDto}:{createUserDto: Pick<User,'firstName'|'lastName'|'email'|'password'>},
	context: ResolverContext
): Promise<User> {
	const encryptedPassword = await argon2.hash(createUserDto.password);
	return await context.orm.user.create({
		data: {
			...createUserDto,
			createdAt: new Date(),
			password: encryptedPassword,
		},
	});
}

export const resolver: Record<keyof User, (parent: User) => unknown> = {
	id: (parent) => parent.id,
	email: (parent) => parent.email,
	firstName: (parent) => parent.firstName,
	lastName: (parent) => parent.lastName,
	password: (parent) => parent.password,
	roles: (parent) => parent.roles,
	createdAt: (parent) => parent.id,
	updatedAt: (parent) => parent.id,
};
