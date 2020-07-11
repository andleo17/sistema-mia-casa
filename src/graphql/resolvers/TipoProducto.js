async function productos({ id }, args, { usuario, prisma }) {
	const where = {};
	if (usuario.rol !== 'ADMIN') where.estado = true;
	return await prisma.tipoProducto.findOne({ where: { id } }).productos({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
		where,
	});
}

async function listarTipoProducto(parent, args, { usuario, prisma }) {
	const where = { nombre: { contains: args.filtro } };
	if (usuario.rol !== 'ADMIN') where.estado = true;
	return await prisma.tipoProducto.findMany({
		where,
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
		orderBy: { id: 'asc' },
	});
}

async function registrarTipoProducto(parent, args, { prisma }) {
	return await prisma.tipoProducto
		.create({ data: { nombre: args.nombre } })
		.catch((err) => null);
}

async function modificarTipoProducto(parent, args, { prisma }) {
	const data = { nombre: args.nombre, estado: args.estado };
	return await prisma.tipoProducto
		.update({ where: { id: parseInt(args.id) }, data })
		.catch((err) => null);
}

async function eliminarTipoProducto(parent, { id }, { prisma }) {
	const numeroProductos = await prisma.producto.count({
		where: { tipoProductoId: parseInt(id) },
	});
	if (numeroProductos == 0) {
		return await prisma.tipoProducto
			.delete({ where: { id: parseInt(id) } })
			.catch((err) => null);
	} else {
		return await prisma.tipoProducto.update({
			where: { id: parseInt(id) },
			data: { estado: false },
		});
	}
}

export const TipoProducto = {
	productos,
};

export const Query = {
	listarTipoProducto,
};

export const Mutation = {
	registrarTipoProducto,
	modificarTipoProducto,
	eliminarTipoProducto,
};
