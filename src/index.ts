/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import http from 'http';

import { PrismaClient } from '@prisma/client';
// Get definitions of types from schema.graphql using loadFiles
import { readFileSync } from 'fs';
import resolvers from './graphql/resolvers';
import path from 'path';

import app from './serverExpress';
import { permissions } from './permissions';
import { applyMiddleware } from 'graphql-middleware';
/* To Do change makeExecutableSchema to new version */

import { makeExecutableSchema } from 'graphql-tools';

const orm = new PrismaClient();
// Manejar el naming simple porque
const httpServer = http.createServer(app);
const port = process.env.PORT || 4000;

const typeDefs = readFileSync(
	path.join(__dirname, 'graphql/schema.graphql'),
	'utf-8'
);

// Passing Prisma Client to server through the context key
const schema = applyMiddleware(
	makeExecutableSchema({
		typeDefs,
		resolvers,
	}),
	permissions
);
export default async function start(){
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		schema,
		context: ({ req }) => {
			console.log(req.user);
			return { orm, user: req.user };
		},
		// context: ({ req }) => ({ orm, user: req.user }),
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});
	await server.start();
	server.applyMiddleware({ app, path: '/graphql' });

	app.listen({ port });
};
