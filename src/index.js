import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import resolvers from './graphql/resolvers.js';
import typeDefs from './graphql/typeDefs.js';

const prisma = new PrismaClient();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: (request) => ({ ...request, prisma }),
});

server.listen().then(({ url }) => {
	console.log(`Servidor iniciado en ${url}`);
});
