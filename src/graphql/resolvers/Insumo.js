async function comprasRealizadas(parent, args, context) {
	return await context.prisma.insumo
		.findOne({ where: { id: parent.id } })
		.compra();
}

async function productos(parent, args, context) {
	return await context.prisma.insumo
		.findOne({ where: { id: parent.id } })
		.insumoProducto();
}

async function listarInsumo(parent, args, context) {
	return await context.prisma.insumo.findMany();
}

async function registrarInsumo(parent, args, context) {
	const data = {
		nombre: args.nombre,
		fechaVencimiento: args.fechaVencimiento,
		cantidad: args.cantidad,
		unidad: args.unidad,
		estado: args.estado,
	};
	return await context.prisma.insumo.create({ data }).catch((err) => null);
}

async function modificarInsumo(parent, args, context) {
	const data = {};
	if (args.nombre) data.nombre = args.nombre;
	if (args.fechaVencimiento) data.fechaVencimiento = args.fechaVencimiento;
	if (args.cantidad) data.cantidad = args.cantidad;
	if (args.unidad) data.unidad = args.unidad;
	if (args.estado) data.estado = args.estado;
	return await context.prisma.insumo
		.update({
			where: { id: parseInt(args.id) },
			data,
		})
		.catch((err) => null);
}

async function eliminarInsumo(parent, args, context) {
	const numeroRecetas = await context.prisma.insumoProducto.count({
		where: { insumoId: parseInt(args.id) },
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
				productos: {
					updateMany: {
						where: { insumoId: parseInt(args.id) },
						data: { estado: false },
					},
				},
			},
		});
	}
}

export const Insumo = {
	comprasRealizadas,
	productos,
};

export const Query = {
	listarInsumo,
};

export const Mutation = {
	registrarInsumo,
	modificarInsumo,
	eliminarInsumo,
};
