export const Mesa = {
	pedidoActual: async (parent, args, context) => {
		const pedidos = await context.prisma.mesa
			.findOne({ where: { id: parent.id } })
			.pedidosRealizados({ where: { estado: true } });
		return pedidos[0];
	},
	pedidosRealizados: async (parent, args, context) => {
		return await context.prisma.mesa
			.findOne({ where: { id: parent.id } })
			.pedidosRealizados();
	},
};

export const Query = {
	listarMesa: async (parent, args, context) => {
		return await context.prisma.mesa.findMany();
	},
};

export const Mutation = {
	registrarMesa: async (parent, args, context) => {
		const data = {
			numero: args.numero,
		};
		return await context.prisma.mesa.create({ data }).catch((err) => null);
	},
	modificarMesa: async (parent, args, context) => {
		const data = {};
		if (args.numero) data.numero = args.numero;
		if (args.ocupado != null) data.ocupado = args.ocupado;
		if (args.estado != null) data.estado = args.estado;
		return await context.prisma.mesa
			.update({
				where: { id: parseInt(args.id) },
				data,
			})
			.catch((err) => null);
	},
	eliminarMesa: async (parent, args, context) => {
		const numeroPedido = await context.prisma.pedido.count({
			where: { mesaId: parseInt(args.id) },
		});
		if (numeroPedido == 0) {
			return await context.prisma.mesa
				.delete({ where: { id: parseInt(args.id) } })
				.catch((err) => null);
		} else {
			return await context.prisma.mesa.update({
				where: { id: parseInt(args.id) },
				data: {
					estado: false,
				},
			});
		}
	},
};
