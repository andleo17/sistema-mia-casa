import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import resolvers from './graphql/resolvers.js';
import typeDefs from './graphql/typeDefs.js';
import { obtenerUsuario } from './utils/utils.js';

const prisma = new PrismaClient();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: (request) => {
		const usuario = obtenerUsuario(request);
		return { usuario, prisma };
	},
});

server.listen({ port: '8080' }).then(({ url }) => {
	console.log(`Servidor iniciado en ${url}`);
});
