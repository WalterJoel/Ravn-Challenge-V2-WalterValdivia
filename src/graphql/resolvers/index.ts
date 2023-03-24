import * as user from './users/users.resolvers';
import * as cart from './cart/cart.resolvers';
import * as order from './orders/order.resolvers';
import * as like from './likes/like.resolvers';
import * as product from './products/products.resolvers';
import * as auth from './auth/auth.resolver'


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
		showClientOrders: order.showClientOrders,
		showMyOrder: order.showMyOrder,
	},
	Mutation: {
		signUp: user.signUp,
		signOut: user.signOut,
		createProduct: product.createProduct,
		updateProduct: product.updateProduct,
		deleteProduct: product.deleteProduct,
		disableProduct: product.disableProduct,
		addProductToCart: cart.addProductToCart,
		buyProducts: order.buyProducts,
		likeProduct: like.likeProduct,
		forgotPassword:auth.forgotPassword,
		validateResetPassword:auth.validateResetPassword
	},
	// User: product.resolver,
};

/* HAY QUE SACAR LOS DTOS
   HAY QUE CREAR EL FOLDER STRATEGIES
   HAY QUE SACAR EL CONTEXT DE AHI */
