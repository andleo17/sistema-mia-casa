function getModel() {
	return {
		pedidosRealizados: async (parent, args, context) => {
			return await context.prisma.producto
				.findOne({ where: { id: parent.id } })
				.pedido();
		},
		receta: async (parent, args, context) => {
			return await context.prisma.producto
				.findOne({ where: { id: parent.id } })
				.insumoProducto();
		},
	};
}

function getQueries() {
	return {
		listarProducto: async (parent, args, context) => {
			return await context.prisma.producto.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarProducto: async (parent, args, context) => {
			const data = {
				nombre: args.nombre,
				descripcion: args.descripcion,
				cantidad: args.cantidad,
				precio: args.precio,
				imagen: args.imagen,
				estado: args.estado,
				tipoProducto: args.tipoProducto,
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
			if (args.tipoProducto) data.tipoProducto = args.tipoProducto;
			return await context.prisma.producto
				.update({
					where: { id: parseInt(args.id) },
					data,
				})
				.catch((err) => null);
		},
		eliminarProducto: async (parent, args, context) => {
			const numeroPedidos = await context.prisma.DetallePedido.count({
				where: { productoId: parseInt(args.id) },
			});
			if (numeroPedidos == 0) {
				return await context.prisma.producto
					.delete({ where: { id: parseInt(args.id) } })
					.catch((err) => null);
			} else {
				return await context.prisma.producto.update({
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
