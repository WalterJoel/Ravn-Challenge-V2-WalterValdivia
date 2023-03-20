/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'

import { PrismaClient } from '@prisma/client';
// Get definitions of types from schema.graphql using loadFiles
import { readFileSync } from 'fs';
import resolvers from './graphql/resolvers';
import path from 'path';

import app from './serverExpress'


const orm = new PrismaClient();
// Manejar el naming simple porque
const httpServer = http.createServer(app)
const port = process.env.PORT || 4000

const typeDefs = readFileSync(
	path.join(__dirname, 'graphql/schema.graphql'),
	'utf-8'
);

// Passing Prisma Client to server through the context key

void (async () => {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context:({ req }) => {
			console.log('req user', req.user);
			return {orm,user:req.user}
		},
		// context: ({ req }) => ({ orm, user: req.user }),
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

	});
	await server.start();
	server.applyMiddleware({ app ,
		path:'/graphql'
	});

	app.listen({ port });
})();
