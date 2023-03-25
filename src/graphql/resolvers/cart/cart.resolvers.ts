import type { Cart, CartItem } from '@prisma/client';
import { checkProductStock } from '../products/products.resolvers';
import { GraphQLError } from 'graphql';

import type { ResolverContext } from '../../context';
import { prisma } from '../../context';

/* Esta funcion deberia llamarse cada vez que se agrega un producto */
export async function addProductToCart(
	parent: unknown,
	args: { addItemToCartDto: CartItem },
	context: ResolverContext
	// ): Promise<void> {
): Promise<CartItem> {
	const currentUserId = context.user?.id;
	/* Aqui el current user ya tiene su carro y sino se crea uno para el */
	const cart = await findOrCreateCart(currentUserId);
	console.log('paso el create cary');
	/* Si existe el item en el carrito  entonces solo actualizo, caso contrario creo */
	const existProductInCart = await context.orm.cartItem.findFirst({
		where: {
			productId: args.addItemToCartDto.id,
			cartId: cart.id,
		},
	});

	if (existProductInCart) {
		/* Dado el producID encuentro el producto y veo que haya en stock la cantidad que se pide, pero comparo con la cantidad que tiene en carrito */
		const product = await checkProductStock(
			args.addItemToCartDto.productId,
			args.addItemToCartDto.quantity,
			existProductInCart.quantity
		);
		// Se asume que ya se reviso que la cantidad requerida del producto hay en stock
		const quantity =
			args.addItemToCartDto.quantity + existProductInCart.quantity;
		const updatedExistedProductInCart = await updateItem(
			existProductInCart.id,
			currentUserId,
			quantity
		);
		return updatedExistedProductInCart;
	}
	return await context.orm.cartItem.create({
		data: {
			cart: {
				connect: {
					id: cart.id,
				},
			},
			product: {
				connect: {
					id: args.addItemToCartDto.productId,
				},
			},
			quantity: args.addItemToCartDto.quantity,
		},
	});
}

async function updateItem(
	id: number,
	userId: number,
	quantity: number
): Promise<CartItem> {
	// Cart Item es un producto que esta en el carrito
	const cartItem = await prisma.cartItem.findFirst({
		where: {
			id,
			cart: {
				userId,
			},
		},
	});
	if (!cartItem) {
		throw new GraphQLError(`Cart Item #${id} not found`);
	}

	const updatedCartItem = await prisma.cartItem.update({
		where: {
			id,
		},
		data: {
			quantity,
		},
		include: {
			product: true,
		},
	});
	return updatedCartItem;
}

// Obtengo los items que estan en el carrito de un usuario en especifico
export async function getItemsFromCart(userId: number) {
	console.log('entro');

	const cart = await prisma.cart.findUnique({
		where: { userId },
		include: {
			items: true,
			user: true,
		},
	});
	if (!cart) {
		throw new GraphQLError(`User #${userId}  not have a cart or is empty`);
	}
	console.log('entro');

	const cartItems = await prisma.cartItem.findMany({
		where: {
			cartId: cart.id,
			product: {
				isVisible: true,
			},
		},
		include: {
			product: true,
		},
	});
	let totalPrice = 0;
	for (const cartItem of cartItems) {
		totalPrice += cartItem.product.price * cartItem.quantity;
	}
	return {
		items: cartItems,
		totalItems: cartItems.length,
		totalPrice,
	};
}

async function findOrCreateCart(userId: number): Promise<Cart> {
	const cart = await prisma.cart.findUnique({
		where: { userId },
		include: {
			items: true, /// Aqui esta el error, el usuario logueado no tiene items
			user: true,
		},
	});
	console.log(cart);
	if (!cart) {
		const newCart = await prisma.cart.create({
			data: {
				user: { connect: { id: userId } },
			},
			include: {
				items: true,
				user: true,
			},
		});
		return newCart;
	}
	return cart;
}

export async function clearCart(userId: number) {
	const cart = await prisma.cart.findUnique({
		where: { userId },
		include: {
			items: true,
			user: true,
		},
	});
	if (!cart) {
		throw new GraphQLError(`User #${userId}  not have a cart, nothing to do`);
	}
	return await prisma.cartItem.deleteMany({
		where: {
			cartId: cart.id,
		},
	});
}
