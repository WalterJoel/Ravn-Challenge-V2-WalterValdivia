import { shield, and } from 'graphql-shield';
import * as rules from './rules';

// Anadir aqui las funciones de todo nuestro esquema y que permisos le daremos
export const permissions = shield(
	{
		Query: {
			// listAllUsers: rules.isClient,
			// seeProducts:rules.isClient
		},
		Mutation: {
			addProductToCart: rules.isManager,
			// likeProduct:rules.isAuthenticated
		},
	},
	{
		allowExternalErrors: true,
	}
);

/* SIGN UP
   SIGN OUT  NO TIENE REGLAS PORQUE CUALQUIERA PUEDE REGISTRARSE  */
