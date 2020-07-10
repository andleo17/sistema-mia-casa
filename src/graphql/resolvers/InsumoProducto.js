async function producto(parent, args, context) {
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
}

async function insumo(parent, args, context) {
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
}

async function modificarReceta(parent, args, context) {
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
}

async function eliminarReceta(parent, args, context) {
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
}

export const InsumoProducto = {
	producto,
	insumo,
};

export const Mutation = {
	modificarReceta,
	eliminarReceta,
};
