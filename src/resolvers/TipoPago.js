function getModel() {
	return {
		pagosPorTipo: async (parent, args, context) => {
			return await context.prisma.tipoPago
				.findOne({ where: { id: parent.id } })
				.pagosPorTipo();
		},
	};
}

function getQueries() {
	return {
		listarTipoPago: async (parent, args, context) => {
			return await context.prisma.tipoPago.findMany();
		},
	};
}

function getMutations() {
	return {
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
			if(args.nombre) data.nombre = args.nombre;
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
}

module.exports = {
	getModel,
	getQueries,
	getMutations,
};
