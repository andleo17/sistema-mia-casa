function getModel() {
	return {
		productos: async (parent, args, context) => {
			return await context.prisma.tipoProducto
				.findOne({ where: { id: parent.id } })
				.productos();
		},
	};
}

function getQueries() {
	return {
		listarTipoProducto: async (parent, args, context) => {
			return await context.prisma.tipoProducto.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarTipoProducto: async (parent, args, context) => {
			const data = {
				nombre: args.nombre,
			};
			return await context.prisma.tipoProducto
				.create({ data })
				.catch((err) => null);
		},
		modificarTipoProducto: async (parent, args, context) => {
			const data = {};
			if (args.nombre) data.nombre = args.nombre;
			if (args.estado != null) {
				data.estado = args.estado;
				if (data.estado == false) {
					data.productos = {
						updateMany: {
							where: {
								tipoProductoId: parseInt(args.id),
							},
							data: { estado: false },
						},
					};
				}
			}
			return await context.prisma.tipoProducto
				.update({
					where: { id: parseInt(args.id) },
					data,
				})
				.catch((err) => null);
		},
		eliminarTipoProducto: async (parent, args, context) => {
			const numeroProductos = await context.prisma.producto.count({
				where: { tipoProductoId: parseInt(args.id) },
			});
			if (numeroProductos == 0) {
				return await context.prisma.tipoProducto
					.delete({ where: { id: parseInt(args.id) } })
					.catch((err) => null);
			} else {
				return await context.prisma.tipoProducto.update({
					where: { id: parseInt(args.id) },
					data: {
						estado: false,
						productos: {
							updateMany: {
								where: { tipoProductoId: parseInt(args.id) },
								data: { estado: false },
							},
						},
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