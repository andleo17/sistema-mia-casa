export const InsumoProducto = {
	producto: async function (parent, args, context) {
		return await context.prisma.insumoProducto
			.findOne({
				where: {
					productoId_insumoId: {
						productoId: parent.productoId,
						insumoId: parent.insumoId,
					},
				},
			})
			.producto();
	},
	insumo: async function (parent, args, context) {
		return await context.prisma.insumoProducto
			.findOne({
				where: {
					productoId_insumoId: {
						productoId: parent.productoId,
						insumoId: parent.insumoId,
					},
				},
			})
			.insumo();
	},
};

export const Mutation = {
	modificarReceta: async (parent, args, context) => {
		const data = {};
		if (args.cantidad) data.cantidad = args.cantidad;
		if (args.unidad) data.unidad = args.unidad;
		return await context.prisma.insumoProducto
			.update({
				where: {
					productoId_insumoId: {
						productoId: parseInt(args.producto),
						insumoId: parseInt(args.insumo),
					},
				},
				data,
			})
			.catch((err) => null);
	},
	eliminarReceta: async (parent, args, context) => {
		return await context.prisma.insumoProducto
			.delete({
				where: {
					productoId_insumoId: {
						productoId: parseInt(args.producto),
						insumoId: parseInt(args.insumo),
					},
				},
			})
			.catch((err) => null);
	},
};
