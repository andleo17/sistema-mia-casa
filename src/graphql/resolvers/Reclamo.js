async function detallePedido({ id }, args, { prisma }) {
	return await prisma.reclamo.findOne({ where: { id } }).detallePedido();
}

async function listarReclamo(parent, args, { prisma }) {
	return await prisma.reclamo.findMany({
		where: { motivo: { contains: args.filtro } },
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function registrarReclamo(parent, args, { prisma }) {
	return await prisma.reclamo
		.create({
			data: {
				motivo: args.motivo,
				detallePedido: {
					connect: {
						pedidoId_productoId: {
							pedidoId: parseInt(args.pedido),
							productoId: parseInt(args.producto),
						},
					},
				},
			},
		})
		.catch((err) => null);
}

async function modificarReclamo(parent, args, { prisma }) {
	return await prisma.reclamo
		.update({
			where: { id: parseInt(args.id) },
			data: {
				motivo: args.motivo,
			},
		})
		.catch((err) => null);
}

async function eliminarReclamo(parent, { id }, { prisma }) {
	return await prisma.reclamo
		.delete({ where: { id: parseInt(id) } })
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
