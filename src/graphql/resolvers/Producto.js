async function tipoProducto(parent, args, context) {
	return await context.prisma.producto
		.findOne({ where: { id: parent.id } })
		.tipoProducto();
}

async function pedidosRealizados(parent, args, context) {
	return await context.prisma.producto
		.findOne({ where: { id: parent.id } })
		.pedidosRealizados();
}

async function receta(parent, args, context) {
	return await context.prisma.producto
		.findOne({ where: { id: parent.id } })
		.receta();
}

async function listarProducto(parent, args, context) {
	return await context.prisma.producto.findMany();
}

async function registrarProducto(parent, args, context) {
	const data = {
		nombre: args.nombre,
		descripcion: args.descripcion,
		cantidad: parseInt(args.cantidad),
		precio: parseFloat(args.precio),
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
	return await context.prisma.producto.create({ data }).catch((err) => null);
}

async function modificarProducto(parent, args, context) {
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
}

async function eliminarProducto(parent, args, context) {
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
}

export const Producto = {
	tipoProducto,
	pedidosRealizados,
	receta,
};

export const Query = {
	listarProducto,
};

export const Mutation = {
	registrarProducto,
	modificarProducto,
	eliminarProducto,
};
