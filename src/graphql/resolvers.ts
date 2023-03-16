import * as product from './products.resolvers';

// Resolvers
export const resolvers = {
	Query: {
		info: () => 'This is mi entry work',
		getProduct: () => {
			return {
				id: '123',
				name: 'joel',
				hobbie: 'tirar',
			};
		},
		product: product.findAll,
	},
	// User: product.resolver,
};
