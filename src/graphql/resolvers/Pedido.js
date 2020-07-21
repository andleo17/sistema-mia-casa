async function pago({ id }, args, { prisma }) {
	return await prisma.pedido.findOne({ where: { id } }).pago();
}

async function personal({ id }, args, { prisma }) {
	return await prisma.pedido.findOne({ where: { id } }).personal();
}

async function mesa({ id }, args, { prisma }) {
	return await prisma.pedido.findOne({ where: { id } }).mesa();
}

async function productos({ id }, args, { prisma }) {
	return await prisma.pedido.findOne({ where: { id } }).productos();
}

async function listarPedido(parent, args, { usuario, prisma }) {
	const where = {};
	if (usuario.rol !== 'ADMIN') where.estado = true;
	return await prisma.pedido.findMany({
		where,
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function registrarPedido(parent, args, { usuario, prisma }) {
	const data = {
		personal: { connect: { id: usuario.id } },
		mesa: { connect: { id: parseInt(args.mesa) } },
		productos: {
			create: args.productos.map((i) => {
				return {
					producto: { connect: { id: parseInt(i.producto) } },
					precio: parseFloat(i.precio),
					cantidad: parseInt(i.cantidad),
				};
			}),
		},
	};

	return await prisma.pedido.create({ data }).catch((err) => null);
}

async function modificarPedido(parent, args, { prisma }) {
	return await prisma.pedido
		.update({
			where: { id: parseInt(args.id) },
			data: { estado: args.estado },
		})
		.catch((err) => null);
}

async function eliminarPedido(parent, { id }, { prisma }) {
	const numeroPagos = await prisma.pago.count({
		where: { pedidoId: parseInt(id) },
	});
	if (numeroPagos === 0) {
		return await prisma.pedido
			.delete({ where: { id: parseInt(id) } })
			.catch((err) => null);
	} else {
		return null;
	}
}

export const Pedido = {
	pago,
	personal,
	mesa,
	productos,
};

export const Query = {
	listarPedido,
};

export const Mutation = {
	registrarPedido,
	modificarPedido,
	eliminarPedido,
};
