export const TipoPago = {
	pagosPorTipo: async (parent, args, context) => {
		return await context.prisma.tipoPago
			.findOne({ where: { id: parent.id } })
			.pagosPorTipo();
	},
};

export const Query = {
	listarTipoPago: async (parent, args, context) => {
		return await context.prisma.tipoPago.findMany();
	},
};

export const Mutation = {
	registrarTipoPago: async (parent, args, context) => {
		const data = {
			nombre: args.nombre,
		};
		return await context.prisma.tipoPago
			.create({ data })
			.catch((err) => null);
	},
	modificarTipoPago: async (parent, args, context) => {
		const data = {};
		if (args.nombre) data.nombre = args.nombre;
		return await context.prisma.tipoPago
			.update({
				where: { id: parseInt(args.id) },
				data,
			})
			.catch((err) => null);
	},
	eliminarTipoPago: async (parent, args, context) => {
		return await context.prisma.tipoPago
			.delete({ where: { id: parseInt(args.id) } })
			.catch((err) => null);
	},
};
