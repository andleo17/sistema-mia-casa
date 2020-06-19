function getModel() {
	return {
		tipoPago: async (parent, args, context) => {
			return await context.prisma.pago
				.findOne({ where: { id: parent.id } })
				.tipoPago();
		},
		pedido: async (parent, args, context) => {
			return await context.prisma.pago
				.findOne({ where: { id: parent.id } })
				.pedido();
		},
	};
}

function getQueries() {
	return {
		listarPago: async (parent, args, context) => {
			return await context.prisma.pago.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarMesa: async (parent, args, context) => {
			const data = {
				serie: args.serie,
				numero: args.numero,
				fecha: args.fecha,
				monto: args.monto,
				tipoPago: { connect: { id: parseInt(args.tipoPago) } },
				pedido: { connect: { id: parseInt(args.pedido) } },
			};
			return await context.prisma.pago
				.create({ data })
				.catch((err) => null);
		},
		eliminarPago: async (parent, args, context) => {
			return await context.prisma.pago
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
