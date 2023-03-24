import { PrismaClient } from '@prisma/client';
import type { Like, User } from '@prisma/client';
import { GraphQLError } from 'graphql';

const prisma = new PrismaClient();

interface ResolverContext {
	orm: PrismaClient;
	user: User | undefined;
}

// Esta funcion le falta validar si el producto existe y es visible
export async function likeProduct(
	parent: unknown,
	args: { productId: number },
	context: ResolverContext
): Promise<Like> {
	const currentuserId = context.user?.id;
	const existProductInFavoriteList = await context.orm.like.findFirst({
		where: {
			productId: args.productId,
			userId: currentuserId,
		},
	});
	console.log('poaso por aqiui');
	if (existProductInFavoriteList) {
		throw new GraphQLError(`You already liked the product ${args.productId}`);
	}

	/* We use connect because if related record doesn't exist, prisma will throw an error */
	return await context.orm.like.create({
		data: {
			product: {
				/* Connecting like to an existing product */
				connect: {
					id: args.productId,
				},
			},
			user: {
				/* Connecting like to an existing user */
				connect: {
					id: currentuserId,
				},
			},
		},
	});
}
