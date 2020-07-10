async function pagosPorTipo(parent, args, context) {
	return await context.prisma.tipoPago
		.findOne({ where: { id: parent.id } })
		.pagosPorTipo();
}

async function listarTipoPago(parent, args, context) {
	return await context.prisma.tipoPago.findMany();
}

async function registrarTipoPago(parent, args, context) {
	const data = {
		nombre: args.nombre,
	};
	return await context.prisma.tipoPago.create({ data }).catch((err) => null);
}

async function modificarTipoPago(parent, args, context) {
	const data = {};
	if (args.nombre) data.nombre = args.nombre;
	return await context.prisma.tipoPago
		.update({
			where: { id: parseInt(args.id) },
			data,
		})
		.catch((err) => null);
}

async function eliminarTipoPago(parent, args, context) {
	return await context.prisma.tipoPago
		.delete({ where: { id: parseInt(args.id) } })
		.catch((err) => null);
}

export const TipoPago = {
	pagosPorTipo,
};

export const Query = {
	listarTipoPago,
};

export const Mutation = {
	registrarTipoPago,
	modificarTipoPago,
	eliminarTipoPago,
};
