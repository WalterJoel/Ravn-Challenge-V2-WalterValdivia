import type { Product, ProductCategory } from '@prisma/client';
import { GraphQLError } from 'graphql';
import type { ResolverContext } from '../../context';
import { prisma } from '../../context';

export async function createProduct(
	parent: unknown,
	// Recojo de User el firstname email y password
	{ createProductDto }: { createProductDto: Product },
	// {createUserDto}:{createUserDto: Pick<User,'firstName'|'lastName'|'email'|'password'>},
	context: ResolverContext
): Promise<Product> {
	return await context.orm.product.create({
		data: {
			...createProductDto,
		},
	});
}

export async function disableProduct(
	parent: unknown,
	// Recojo de User el firstname email y password
	args: { id: number },
	// {createUserDto}:{createUserDto: Pick<User,'firstName'|'lastName'|'email'|'password'>},
	context: ResolverContext
): Promise<Product> {
	return await context.orm.product.update({
		where: {
			id: args.id,
		},
		data: {
			isVisible: false,
		},
	});
}

// export class PaginationResponseDto<T> {
// 	items: T[];

// 	total: number;

// 	page: number;

// 	limit: number;

// 	hasNext: boolean;

// 	hasPrev: boolean;

// 	constructor(items: T[], total: number, page: number, limit: number) {
// 	  this.items = items;
// 	  this.total = total;
// 	  this.page = page;
// 	  this.limit = limit;
// 	  this.hasNext = page * limit < total;
// 	  this.hasPrev = page > 1;
// 	}

// 	get totalPages(): number {
// 	  return Math.ceil(this.total / this.limit);
// 	}
//   }

// export class SearchProductQueryDto extends PartialType(PaginationQueryDto) {
//   @IsOptional()
//   category?: string;
// }
// export async function findAll(
//     searchProductQueryDto: SearchProductQueryDto,
//     conditions?: Record<string, any>,
//   ): Promise<PaginationResponseDto<Product>> {
//     const limit = searchProductQueryDto.|| 10;
//     const page = searchProductQueryDto.page || 1;
//     const items = await prisma.product.findMany({
//       where: {
//         ...conditions,
//       },
//       take: limit,
//       skip: (page - 1) * limit,
//       include: {
//         images: true,
//       },
//     });
//     const total = await prisma.product.count({
//       where: {
//         ...conditions,
//       },
//     });
//     return new PaginationResponseDto(items, total, page, limit);
//   }

export async function seeProducts(
	parent: unknown,
	arg: unknown,
	context: ResolverContext
): Promise<Product[]> {
	return await context.orm.product.findMany();
}

async function findOne(
	parent: unknown,
	args: { id: number }
): Promise<Product | null> {
	return await prisma.product.findUnique({
		where: { id: args.id },
	});
}
/**
 * This function finds a product by its ID and check if the requested quantity is available
 * @param {string} id - number - id  product we want to find.
 * @param {number} quantity - number - the quantity of the product that the user wants to buy
 * @returns A product
 */
export async function checkProductStock(
	id: number,
	quantity: number,
	quantityCartItem: number
): Promise<Product | null> {
	const product = await prisma.product.findUnique({
		where: { id },
	});

	if (product) {
		if (!product.isVisible) {
			throw new GraphQLError(`Product #${id} is not enabled.`);
		}
	}

	if (!product) {
		throw new Error(`Product Not exists`);
	}
	// Si la cantidad que se solicita es igual o menor que el stock y ademas
	if (product.stock < quantity) {
		throw new GraphQLError(
			`Invalid quantity, not enough stock for Product #${id}`
		);
	}
	// si la cantidad que solicita agregar al carrito no excede la cantidad ya existente
	if (product.stock < quantityCartItem) {
		throw new GraphQLError(
			`Invalid quantity, you have ${quantityCartItem} products in cart, it exceeds quantity in stock`
		);
	}
	return product;
}

/**
 * We first find the product by id, only if exists, then we update the product with the new data
 * @param {number} ids - number - The id of the product we want to update.
 * @param {UpdateProductDto} updateProductDto - UpdateProductDto
 * @returns The updated product.
 */

//  Falta validar que exista
export async function updateProduct(
	_: any,
	args: { id: number; updateProductDto: Product },
	context: ResolverContext
): Promise<Product> {
	const findProduct = await findOne(_, { id: args.id });
	/* True if findProduct is undefined or null */
	if (findProduct == null) {
		throw new Error(`Product ${args.id} not found`);
	}
	return await context.orm.product.update({
		where: {
			id: args.id,
		},
		data: {
			...args.updateProductDto,
		},
	});
}

/**
 * We first find the product by its id, then we delete it
 * @param {number} id - The id of the product to be deleted.
 * @returns The deleted product
 */

export async function deleteProduct(
	_: any,
	args: { id: number },
	context: ResolverContext
): Promise<Product> {
	const findProduct = await findOne(_, { id: args.id });
	/* True if findProduct is undefined or null */
	if (findProduct == null) {
		throw new Error(`Product ${args.id} not exists`);
	}
	try {
		return await context.orm.product.delete({
			where: {
				id: args.id,
			},
		});
	} catch (error: any) {
		throw error.message;
	}
}

export async function searchProductsByCategory(
	_: any,
	args: { categorys: (typeof ProductCategory)[keyof typeof ProductCategory] },
	context: ResolverContext
): Promise<Product[]> {
	return await context.orm.product.findMany({
		where: {
			category: args.categorys,
		},
	});
}
