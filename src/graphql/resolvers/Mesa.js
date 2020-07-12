import { AuthenticationError } from 'apollo-server';
import { CAMPO_NO_ADMIN } from '../../utils/errors';

async function pedidoActual({ id }, args, { prisma }) {
	const pedidos = await prisma.mesa
		.findOne({ where: { id } })
		.pedidosRealizados({ where: { estado: true } });
	return pedidos[0];
}

async function pedidosRealizados({ id }, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN')
		throw new AuthenticationError(CAMPO_NO_ADMIN('pedidos realizados'));
	return await prisma.mesa.findOne({ where: { id } }).pedidosRealizados({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function listarMesa(parent, args, { usuario, prisma }) {
	const where = {};
	if (usuario.rol !== 'ADMIN') where.estado = true;
	return await prisma.mesa.findMany({
		where,
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
		orderBy: { numero: 'asc' },
	});
}

async function registrarMesa(parent, args, { prisma }) {
	return await prisma.mesa
		.create({ data: { numero: args.numero } })
		.catch((err) => null);
}

async function modificarMesa(parent, args, { prisma }) {
	const data = { numero: args.numero, estado: args.estado };
	return await prisma.mesa
		.update({ where: { id: parseInt(args.id) }, data })
		.catch((err) => null);
}

async function eliminarMesa(parent, { id }, { prisma }) {
	const numeroPedido = await prisma.pedido.count({
		where: { mesaId: parseInt(id) },
	});
	if (numeroPedido === 0) {
		return await prisma.mesa
			.delete({ where: { id: parseInt(id) } })
			.catch((err) => null);
	} else {
		return await prisma.mesa.update({
			where: { id: parseInt(id) },
			data: { estado: false },
		});
	}
}

export const Mesa = {
	pedidoActual,
	pedidosRealizados,
};

export const Query = {
	listarMesa,
};

export const Mutation = {
	registrarMesa,
	modificarMesa,
	eliminarMesa,
};
