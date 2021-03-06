import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import resolvers from './graphql/resolvers.js';
import typeDefs from './graphql/typeDefs.js';
import { obtenerUsuario } from './utils/utils.js';

const prisma = new PrismaClient();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req, connection }) => {
		if (req) {
			const usuario = obtenerUsuario(req.get('Authorization'));
			return { usuario, prisma };
		} else {
			return connection.context;
		}
	},
	subscriptions: {
		onConnect: (connectionParams, webSocket) => {
			const usuario = obtenerUsuario(connectionParams.Authorization);
			return { usuario, prisma };
		},
	},
});

server
	.listen({ port: process.env.PORT || 4000 })
	.then(({ url, subscriptionsUrl }) => {
		console.log(`Servidor iniciado en ${url}`);
		console.log(`Subscripciones en ${subscriptionsUrl}`);
	});
