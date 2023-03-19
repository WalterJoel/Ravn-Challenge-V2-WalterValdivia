import { ApolloServer } from 'apollo-server-express';
import express from 'express'
import { PrismaClient } from '@prisma/client';
import {buildContext} from 'graphql-passport'
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

void (async ()=>{
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		// context: {
		// 	orm,
		// },
		context:({req,res}) => {
			console.log(req)
			return buildContext({req,res, orm})
		},
	});
	await server.start();
	const app = express();
	server.applyMiddleware({ app });
	
	app.listen({port:4000})
	
})()
