import { AuthenticationError } from 'apollo-server';
import { CAMPO_NO_ADMIN } from '../../utils/errors';

async function pagosPorTipo({ id }, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN')
		throw new AuthenticationError(CAMPO_NO_ADMIN('pagos por tipo'));
	return await prisma.tipoPago.findOne({ where: { id } }).pagosPorTipo({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function listarTipoPago(parent, args, { prisma }) {
	return await prisma.tipoPago.findMany();
}

async function registrarTipoPago(parent, args, { prisma }) {
	return await prisma.tipoPago
		.create({ data: { nombre: args.nombre } })
		.catch((err) => null);
}

async function modificarTipoPago(parent, args, { prisma }) {
	const data = { nombre: args.nombre, estado: args.estado };
	return await prisma.tipoPago
		.update({
			where: { id: parseInt(args.id) },
			data,
		})
		.catch((err) => null);
}

async function eliminarTipoPago(parent, { id }, { prisma }) {
	return await prisma.tipoPago
		.delete({ where: { id: parseInt(id) } })
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
