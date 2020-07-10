export const Producto = {
	tipoProducto: async (parent, args, context) => {
		return await context.prisma.producto
			.findOne({ where: { id: parent.id } })
			.tipoProducto();
	},
	pedidosRealizados: async (parent, args, context) => {
		return await context.prisma.producto
			.findOne({ where: { id: parent.id } })
			.pedidosRealizados();
	},
	receta: async (parent, args, context) => {
		return await context.prisma.producto
			.findOne({ where: { id: parent.id } })
			.receta();
	},
};

export const Query = {
	listarProducto: async (parent, args, context) => {
		return await context.prisma.producto.findMany();
	},
};

export const Mutation = {
	registrarProducto: async (parent, args, context) => {
		const data = {
			nombre: args.nombre,
			descripcion: args.descripcion,
			cantidad: args.cantidad,
			precio: args.precio,
			imagen: args.imagen,
			estado: args.estado,
			tipoProducto: { connect: { id: parseInt(args.tipoProducto) } },
			receta: {
				create: args.receta.map((i) => {
					return {
						cantidad: i.cantidad,
						unidad: i.unidad,
						insumo: { connect: { id: parseInt(i.insumo) } },
					};
				}),
			},
		};
		return await context.prisma.producto
			.create({ data })
			.catch((err) => null);
	},
	modificarProducto: async (parent, args, context) => {
		const data = {};
		if (args.nombre) data.nombre = args.nombre;
		if (args.descripcion) data.descripcion = args.descripcion;
		if (args.cantidad) data.cantidad = args.cantidad;
		if (args.precio) data.precio = args.precio;
		if (args.imagen) data.imagen = args.imagen;
		if (args.estado) data.estado = args.estado;
		if (args.tipoProducto)
			data.tipoProducto = {
				connect: { id: parseInt(args.tipoProducto) },
			};
		// TODO: Realizar lógica para actualizar
		return await context.prisma.producto
			.update({
				where: { id: parseInt(args.id) },
				data,
			})
			.catch((err) => null);
	},
	eliminarProducto: async (parent, args, context) => {
		const NumeroPedidos = await context.prisma.detallePedido.count({
			where: { productoId: parseInt(args.id) },
		});
		if (NumeroPedidos == 0) {
			await context.prisma.insumoProducto.deleteMany({
				where: {
					productoId: parseInt(args.id),
				},
			});
			return await context.prisma.producto
				.delete({
					where: {
						id: parseInt(args.id),
					},
				})
				.catch((err) => err);
		} else {
			return await context.prisma.producto
				.update({
					where: { id: parseInt(args.id) },
					data: {
						estado: false,
					},
				})
				.catch((err) => null);
		}
	},
};
