const { GraphQLServer } = require('graphql-yoga');
const { PrismaClient } = require('@prisma/client');
const Resolvers = require('./resolvers');
const prisma = new PrismaClient();

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers: {
		...Resolvers,
	},
	context: (request) => {
		return {
			...request,
			prisma,
		};
	},
});

server.start(() => console.log('Server is running on http://localhost:4000/'));
