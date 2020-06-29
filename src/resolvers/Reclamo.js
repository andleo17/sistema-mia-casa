function getModel() {
	return {
		detallePedido: async (parent, args, context) => {
			return await context.prisma.reclamo
				.findOne({ where: { id: parent.id } })
				.detallePedido();
		},
	};
}

function getQueries() {
	return {
		listarReclamo: async (parent, args, context) => {
			return await context.prisma.reclamo.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarReclamo: async (parent, args, context) => {
			const data = {
				motivo: args.motivo,
				detallePedido: { connect: { id: parseInt(args.detallePedido) } },
			};
			return await context.prisma.reclamo
				.create({ data })
				.catch((err) => null);
		},
		modificarReclamo: async (parent, args, context) => {
			const data = {};
			if(args.motivo) motivo = args.motivo;
			if(args.detallePedido) detallePedido = { connect: { id: parseInt(args.detallePedido) } };
			return await context.prisma.reclamo
				.update({
					where: { id: parseInt(args.id) },
					data,
				})
				.catch((err) => null);
		},
		eliminarReclamo: async (parent, args, context) => {
			return await context.prisma.reclamo
				.delete({ where: { id: parseInt(args.id) } })
				.catch((err) => null);
		},
	};
}

module.exports = {
	getModel,
	getQueries,
	getMutations,
};
