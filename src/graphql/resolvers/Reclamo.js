async function detallePedido(parent, args, context) {
	return await context.prisma.reclamo
		.findOne({ where: { id: parent.id } })
		.detallePedido();
}

async function listarReclamo(parent, args, context) {
	return await context.prisma.reclamo.findMany();
}

async function registrarReclamo(parent, args, context) {
	const data = {
		motivo: args.motivo,
		detallePedido: { connect: { id: parseInt(args.detallePedido) } },
	};
	return await context.prisma.reclamo.create({ data }).catch((err) => null);
}

async function modificarReclamo(parent, args, context) {
	const data = {};
	if (args.motivo) motivo = args.motivo;
	if (args.detallePedido)
		detallePedido = { connect: { id: parseInt(args.detallePedido) } };
	return await context.prisma.reclamo
		.update({
			where: { id: parseInt(args.id) },
			data,
		})
		.catch((err) => null);
}

async function eliminarReclamo(parent, args, context) {
	return await context.prisma.reclamo
		.delete({ where: { id: parseInt(args.id) } })
		.catch((err) => null);
}

export const Reclamo = {
	detallePedido,
};

export const Query = {
	listarReclamo,
};

export const Mutation = {
	registrarReclamo,
	modificarReclamo,
	eliminarReclamo,
};
