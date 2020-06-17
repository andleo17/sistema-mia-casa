function getModel() {
	return {
		comprasRealizadas: async (parent, args, context) => {
			return await context.prisma.insumo
				.findOne({ where: { id: parent.id } })
				.compra();
		},
		productos: async (parent, args, context) => {
			return await context.prisma.insumo
				.findOne({ where: { id: parent.id } })
				.insumoProducto();
		},
	};
}

function getQueries() {
	return {
		listarInsumo: async (parent, args, context) => {
			return await context.prisma.insumo.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarInsumo: async (parent, args, context) => {
			const data = {
				nombre: args.nombre,
				fechaVencimiento: args.fechaVencimiento,
				cantidad: args.cantidad,
				unidad: args.unidad,
				estado: args.estado,
			};
			return await context.prisma.insumo
				.create({ data })
				.catch((err) => null);
		},
		modificarInsumo: async (parent, args, context) => {
			const data = {};
			if (args.nombre) nombre = args.nombre;
			if (args.fechaVencimiento) fechaVencimiento = args.fechaVencimiento;
			if (args.cantidad) cantidad = args.cantidad;
			if (args.unidad) unidad = args.unidad;
			if (args.estado) estado = args.estado;
			return await context.prisma.insumo
				.update({
					where: { id: parseInt(args.id) },
					data,
				})
				.catch((err) => null);
		},
		eliminarInsumo: async (parent, args, context) => {
			const numeroRecetas = await context.prisma.insumoProducto.count({
				where: { insumo: parseInt(args.id) },
			});
			if (numeroRecetas == 0) {
				return await context.prisma.insumo
					.delete({ where: { id: parseInt(args.id) } })
					.catch((err) => null);
			} else {
				return await context.prisma.insumo.update({
					where: { id: parseInt(args.id) },
					data: {
						estado: false,
					},
				});
			}
		},
	};
}

module.exports = {
	getModel,
	getQueries,
	getMutations,
};
