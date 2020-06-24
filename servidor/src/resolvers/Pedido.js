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
				personal: { connect: { id: parseInt(args.personal) } },
				mesa: { connect: { id: parseInt(args.mesa) } },
				productos: {
					create: args.productos.map((i) => {
						return {
							producto: { connect: { id: parseInt(i.producto) } },
							precio: i.precio,
							cantidad: i.cantidad,
						};
					}),
				},
			};

			return await context.prisma.pedido
				.create({ data })
				.catch((err) => null);
		},
		modificarPedido: async (parent, args, context) => {
			const data = {};
			if (args.productos)
				data.productos = {
					create: args.productos.map((i) => {
						return {
							producto: { connect: { id: parseInt(i.producto) } },
							precio: i.precio,
							cantidad: i.cantidad,
							entregado: i.entregado,
							estado: i.estado,
						};
					}),
				};
			if (args.estado != null) estado = args.estado;
			if (args.mesa) mesa = { connect: { id: parseInt(args.mesa) } };
			return await context.prisma.pedido
				.update({
					where: { id: parseInt(args.id) },
					data,
				})
				.catch((err) => null);
		},
		eliminarPedido: async (parent, args, context) => {
			const numeroPagos = await context.prisma.pago.count({
				where: { pedidoId: parseInt(args.id) },
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
