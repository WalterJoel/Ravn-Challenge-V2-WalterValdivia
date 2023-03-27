import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import type { ResolverContext } from '../../context';
import { GraphQLError } from 'graphql';

/**  This function list all users from the database, include attributes like orders which in turn
 *  includes items too
 * @returns all users from database
 */
export async function listAllUsers(
	parent: unknown,
	arg: unknown,
	context: ResolverContext
): Promise<User[]> {
	return await context.orm.user.findMany({
		include: {
			Orders: {
				include: {
					items: true,
				},
			},
			Cart: true,
			Like: true,
		},
	});
}

/** Function for register or sign up user
 *
 * @param createUserDto Set of fields to create a new user imported from schema GraphQL
 * @returns new created user
 */
export async function signUp(
	parent: unknown,
	{ createUserDto }: { createUserDto: User },
	context: ResolverContext
): Promise<User> {
	const user = await context.orm.user.findUnique({
		where: { email: createUserDto.email },
	});
	if (user) {
		throw new GraphQLError('Email is already in use');
	}
	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(createUserDto.password, salt);
	return await context.orm.user.create({
		data: {
			...createUserDto,
			createdAt: new Date(),
			password: encryptedPassword,
		},
	});
}

export function signOut(
	parent: unknown,
	arg: unknown,
	context: ResolverContext
) {
	if (context.user === undefined) {
		throw new Error('Not Exist Session or User');
	}
	return { message: 'User has been signed out' };
}
