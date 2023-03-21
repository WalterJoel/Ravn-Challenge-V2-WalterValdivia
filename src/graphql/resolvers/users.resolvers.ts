import type { User, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

interface ResolverContext {
	orm: PrismaClient;
	user:Express.User | undefined;

}
export async function findAll(
	parent: unknown,
	arg: unknown,
	context: ResolverContext
): Promise<User[]> {
	console.log(context.user, ' el email');
	return await context.orm.user.findMany();
}

export async function signUp(
	parent: unknown,
	// Recojo de User el firstname email y password
	{ createUserDto }: { createUserDto: User },
	// {createUserDto}:{createUserDto: Pick<User,'firstName'|'lastName'|'email'|'password'>},
	context: ResolverContext
): Promise<User> {
	const user = await context.orm.user.findUnique({ where: { email:createUserDto.email} })
	if(user){
		throw new Error('Email is already in use');
	}
	const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(createUserDto.password,salt);
	return await context.orm.user.create({
		data: {
			...createUserDto,
			createdAt: new Date(),	
			password: encryptedPassword,
		},
	});	
}

export function signOut(parent: unknown, arg:unknown, context:ResolverContext){
	if(context.user === undefined){
		throw new Error('Not Exist Session or User')
	}
	return {message:"User has been signed out"};

}
// export async function forgotPassword(
// 	parent: unknown,
// 	// Recojo de User el firstname email y password
// 	{ createUserDto }: { createUserDto: User },
// 	// {createUserDto}:{createUserDto: Pick<User,'firstName'|'lastName'|'email'|'password'>},
// 	context: ResolverContext
// ): Promise<User> {
// 	const salt = await bcrypt.genSalt(10);
//     const encryptedPassword = await bcrypt.hash(createUserDto.password,salt);
// 	return await context.orm.user.create({
// 		data: {
// 			...createUserDto,
// 			createdAt: new Date(),
// 			password: encryptedPassword,
// 		},
// 	});
// }

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
