function getModel() {
	return {
		pago: async (parent, args, context) => {
			return await context.prisma.pedido
				.findOne({ where: { id: parent.id } })
				.pago();
		},
		personal: async (parent, args, context) => {
			return await context.prisma.pedido
				.findOne({ where: { id: parent.id } })
				.personal();
		},
		mesa: async (parent, args, context) => {
			return await context.prisma.pedido
				.findOne({ where: { id: parent.id } })
				.mesa();
		},
		reclamo: async (parent, args, context) => {
			return await context.prisma.pedido
				.findOne({ where: { id: parent.id } })
				.reclamo();
		},
		productos: async (parent, args, context) => {
			return await context.prisma.pedido
				.findOne({ where: { id: parent.id } })
				.productos();
		},
	};
}

function getQueries() {
	return {
		listarPedido: async (parent, args, context) => {
			return await context.prisma.pedido.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarPedido: async (parent, args, context) => {
			const data = {
				personal: args.personal,
				mesa: args.mesa,
				productos: { connect: { id: parseInt(args.productos) } },
			};
			return await context.prisma.pedido
				.create({ data })
				.catch((err) => null);
		},
		modificarPedido: async (parent, args, context) => {
			const data = {};
			if (args.productos) data.productos = { connect: { id: parseInt(args.productos) } };
			if (args.estado != null) estado = args.estado;
			return await context.prisma.pedido
				.update({
					where: { id: parseInt(args.id) },
					data,
				})
				.catch((err) => null);
		},
		eliminarPedido: async (parent, args, context) => {
			const numeroPagos = await context.prisma.pago.count({
				where: { personalId: parseInt(args.id) },
			});
			if (numeroPagos == 0) {
				return await context.prisma.pedido
					.delete({ where: { id: parseInt(args.id) } })
					.catch((err) => null);
			} else {
				return null;
			}
		},
	};
}

module.exports = {
	getModel,
	getQueries,
	getMutations,
};
