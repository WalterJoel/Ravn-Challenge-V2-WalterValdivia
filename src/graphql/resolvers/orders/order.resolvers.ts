import { PrismaClient } from '@prisma/client';
import type { Order, User , OrderItem} from '@prisma/client';
import { GraphQLError } from 'graphql';
import { getItemsFromCart, clearCart } from '../cart/cart.resolvers';
const prisma = new PrismaClient();

interface ResolverContext {
	orm: PrismaClient;
	user: User | undefined;
}

export async function buyProducts(
	parent: unknown,
	args: { userId: number },
	context: ResolverContext
): Promise<Order> {
	const cart = await getItemsFromCart(args.userId);
	const orderItems = cart.items.map((item) => ({
		quantity: item.quantity,
		price: item.product.price,
		product: {
			connect: {
				id: item.product.id,
			},
		},
	}));

	const order = await prisma.order.create({
		data: {
			total: cart.totalPrice,
			items: {
				create: orderItems,
			},
			user: {
				connect: {
					id: args.userId,
				},
			},
		},
		include: {
			items: true,
		},
	});
	await clearCart(args.userId);
	return order;
}

// estear esto
// Recibe un user client o nada para q devuelva todo
export async function showClientOrders(userId?: number) {
	const whereClause = userId ? { userId } : {};
	const items = await prisma.order.findMany({
		where: whereClause,
		include: {
			user: true,

			items: {
				include: {
					product: true,
				},
			},
		},
	});
	return items;
}
export async function showMyOrder(
	parent: unknown,
	arg: unknown,
	context: ResolverContext
) {
	const currentUserId = context.user?.id;
	const myOrders = await showClientOrders(currentUserId);
	if (!myOrders) {
		throw new GraphQLError('You dont have any orders');
	}
	return myOrders;
}

// async function discountStockAndNotify
// (
// 	parent: unknown,
// 	args:{orderItems:OrderItem} ,
// 	context: ResolverContext
// ) {
// 	const currentUserId = context.user?.id;
	






// 	return myOrders;
// }
