import * as user from './users.resolvers';
// Resolvers
export default  {
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
		
	},
	Mutation:{
		addUser: user.addUser
	}
	// User: product.resolver,
};
