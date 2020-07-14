import { AuthenticationError } from 'apollo-server';
import { CAMPO_NO_ADMIN } from '../../utils/errors';

async function comprasRealizadas({ id }, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN')
		throw new AuthenticationError(CAMPO_NO_ADMIN('compras realizadas'));
	return await prisma.insumo.findOne({ where: { id } }).comprasRealizadas({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function productos({ id }, args, { prisma }) {
	return await prisma.insumo.findOne({ where: { id } }).productos({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function listarInsumo(parent, args, { usuario, prisma }) {
	const where = { nombre: { contains: args.filtro } };
	if (usuario.rol !== 'ADMIN') where.estado = true;
	return await prisma.insumo.findMany({
		where,
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
		orderBy: { id: 'asc' },
	});
}

async function registrarInsumo(parent, args, { prisma }) {
	return await prisma.insumo
		.create({
			data: {
				nombre: args.nombre,
				fechaVencimiento: args.fechaVencimiento,
				cantidad: args.cantidad,
				unidad: args.unidad,
				estado: args.estado,
			},
		})
		.catch((err) => null);
}

async function modificarInsumo(parent, args, { prisma }) {
	return await prisma.insumo
		.update({
			where: { id: parseInt(args.id) },
			data: {
				nombre: args.nombre,
				fechaVencimiento: args.fechaVencimiento,
				cantidad: args.cantidad,
				unidad: args.unidad,
				estado: args.estado,
			},
		})
		.catch((err) => null);
}

async function eliminarInsumo(parent, { id }, { prisma }) {
	const numeroRecetas = await prisma.insumoProducto.count({
		where: { insumoId: parseInt(id) },
	});
	if (numeroRecetas == 0) {
		return await prisma.insumo
			.delete({ where: { id: parseInt(id) } })
			.catch((err) => null);
	} else {
		return await prisma.insumo.update({
			where: { id: parseInt(id) },
			data: { estado: false },
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
