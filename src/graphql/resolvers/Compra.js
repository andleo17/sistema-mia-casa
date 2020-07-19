import { AuthenticationError } from 'apollo-server';
import { NO_ADMIN } from '../../utils/errors';

async function insumos({ id }, args, { prisma }) {
	return await prisma.compra.findOne({ where: { id } }).insumos();
}

async function listarCompra(parent, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN') throw new AuthenticationError(NO_ADMIN);
	return await prisma.compra.findMany({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function registrarCompra(parent, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN') throw new AuthenticationError(NO_ADMIN);
	const data = {
		serie: parseInt(args.serie),
		numero: parseInt(args.numero),
		precio: parseFloat(args.precio),
		fecha: args.fecha,
		insumos: {
			create: args.insumos.map((i) => {
				return {
					importe: parseFloat(i.importe),
					cantidad: parseFloat(i.cantidad),
					unidad: i.unidad,
					insumo: {
						connect: { id: parseInt(i.insumo) },
					},
				};
			}),
		},
	};
	return await prisma.compra.create({ data }).catch((err) => null);
}

async function modificarCompra(parent, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN') throw new AuthenticationError(NO_ADMIN);
	const data = {
		serie: parseInt(args.serie),
		numero: parseInt(args.numero),
		precio: parseFloat(args.precio),
		fecha: args.fecha,
	};
	return await context.prisma.compra
		.update({
			where: { id: parseInt(args.id) },
			data,
		})
		.catch((err) => null);
}

export const Compra = {
	insumos,
};

export const Query = {
	listarCompra,
};

export const Mutation = {
	registrarCompra,
	modificarCompra,
};
