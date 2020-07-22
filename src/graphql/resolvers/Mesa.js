//Importaciones de espacio de nombres
import { AuthenticationError } from 'apollo-server';
import { CAMPO_NO_ADMIN } from '../../utils/errors';

//Devuelve el pedido que ya ha sido atendido de una mesa
async function pedidoActual({ id }, args, { prisma }) {
	const pedidos = await prisma.mesa
		.findOne({ where: { id } })
		.pedidosRealizados({ where: { estado: true } });
	return pedidos[0];
}

//Lista el pedido pendiente actual con el que cuenta una mesa.
async function pedidosRealizados({ id }, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN')
		throw new AuthenticationError(CAMPO_NO_ADMIN('pedidos realizados'));
	return await prisma.mesa.findOne({ where: { id } }).pedidosRealizados({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

//Devuelve un listado de todas las mesas, además permite filtrar por número de mesa
async function listarMesa(parent, args, { usuario, prisma }) {
	const where = { numero: args.filtro };
	if (usuario.rol !== 'ADMIN') where.estado = true;
	return await prisma.mesa.findMany({
		where,
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
		orderBy: { numero: 'asc' },
	});
}

//Registra una nueva mesa, recibe como parámetro el número de la mesa
async function registrarMesa(parent, args, { prisma }) {
	return await prisma.mesa
		.create({ data: { numero: parseInt(args.numero) } })
		.catch((err) => null);
}

//Modifica una mesa existente, recibe como parámetros el id, número y estado de la mesa.
async function modificarMesa(parent, args, { prisma }) {
	const data = { numero: parseInt(args.numero), estado: args.estado };
	return await prisma.mesa
		.update({ where: { id: parseInt(args.id) }, data })
		.catch((err) => null);
}

//Elimina una mesa existente, recibe como parámetro el id de una mesa
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

//Especificación de resolvers

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
