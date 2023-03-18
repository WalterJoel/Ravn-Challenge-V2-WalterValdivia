import { ApolloServer } from 'apollo-server';

import { PrismaClient } from '@prisma/client';

// Get definitions of types from schema.graphql using loadFiles
import { readFileSync } from 'fs';
import resolvers from './graphql/resolvers';
import path from 'path';
const orm = new PrismaClient();
// Manejar el naming simple porque

const typeDefs = readFileSync(
	path.join(__dirname, 'graphql/schema.graphql'),
	'utf-8'
);

// Passing Prisma Client to server through the context key
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: {
		orm,
	},
});

server
	.listen()
	.then(({ url }) => {
		console.log(`Server listening on port ${url}`);
	})
	.catch(() => 'Error on Server Start');
