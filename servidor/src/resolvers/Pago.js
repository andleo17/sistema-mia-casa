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
		registrarPago: async (parent, args, context) => {
			const data = {
				serie: "sre",
				numero: "ff",
				monto: args.monto,
				tipoPago: { connect: { id: parseInt(args.tipoPago) } },
				pedido: { connect: { id: parseInt(args.pedido) } },
			};
			await context.prisma.pedido
				.update({
					where: {id: parseInt(args.pedido)},
					data: {estado: false},
				})
				.catch((err) => null);
			const pedido = await context.prisma.pedido.findOne({
				where: {id: parseInt(args.pedido)}
			});
			const mesa = pedido.mesaId;
			await context.prisma.mesa
				.update({
					where: {id: mesa},
					data: {ocupado: false},
				})
				.catch((err) => err);
			return await context.prisma.pago
				.create({ data })
				.catch((err) => err);
		},
		eliminarPago: async (parent, args, context) => {
			const pago = await context.prisma.pago.findOne({
				where: {id: parseInt(args.id)}
			});
			await context.prisma.pedido
				.update({
					where: {id: pago.pedidoId},
					data: {estado: true},
				})
				.catch((err) => null);
			const pedido = await context.prisma.pedido.findOne({
				where: {id: pago.pedidoId}
			});
			await context.prisma.mesa
				.update({
					where: {id: pedido.mesaId},
					data: {ocupado: true},
				})
				.catch((err) => err);
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
