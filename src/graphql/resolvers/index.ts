import * as user from './users.resolvers';
import * as product from './products.resolvers';
// Resolvers
export default {
	Query: {
		info: () => 'This is mi entry work',
		getProduct: () => {
			return {
				id: '123',
				name: 'joel',
				hobbie: 'tirar',
			};
		},
		user: user.findAll,
		// findOne:product.findOne
		seeProducts: product.seeProducts,
		searchProductsByCategory: product.searchProductsByCategory,
	},
	Mutation: {
		signUp: user.signUp,
		signOut: user.signOut,	
		createProduct: product.createProduct,
		updateProduct: product.updateProduct,
		deleteProduct: product.deleteProduct,
	},
	// User: product.resolver,
};
