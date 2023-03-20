// import { PrismaClient } from '@prisma/client';
// import type { Cart, ProductCategory} from '@prisma/client';

// const prisma = new PrismaClient();

// interface ResolverContext {
// 	orm: PrismaClient;
// }

// export async function createProduct(
// 	parent: unknown,
// 	{ createProductDto }: { createProductDto: Cart},
// 	// {createUserDto}:{createUserDto: Pick<User,'firstName'|'lastName'|'email'|'password'>},
// 	context: ResolverContext
// ): Promise<Cart> {
// 	return await context.orm.product.create({
// 		data: {
// 			...createProductDto,
// 		},
// 	});
// }
