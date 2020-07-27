//Importaciones de nombres de espacio
import { PubSub, withFilter } from 'apollo-server';
import { MESA_OCUPADA } from '../../utils/errors';
const pubsub = new PubSub();

//Declaración de tipo de error
const PEDIDO_AGREGADO = 'PEDIDO_AGREGADO';

//Devuelve el pago de un pedido, la búsqueda es por id
async function pago({ id }, args, { prisma }) {
	return await prisma.pedido.findOne({ where: { id } }).pago();
}

//Devuelve al empleado que ha atendo el pedido.
async function personal({ id }, args, { prisma }) {
	return await prisma.pedido.findOne({ where: { id } }).personal();
}

//Devuelve la mesa donde se realizó el pedido
async function mesa({ id }, args, { prisma }) {
	return await prisma.pedido.findOne({ where: { id } }).mesa();
}

//Devuelve el producto de un pedido
async function productos({ id }, args, { prisma }) {
	return await prisma.pedido.findOne({ where: { id } }).productos();
}

//Lista todos lo pedidos
async function listarPedido(parent, args, { usuario, prisma }) {
	const where = {};
	if (usuario.rol !== 'ADMIN') where.estado = true;
	if (args.pago == false) where.pago = null;
	if (args.mesa){
		const mesita = await prisma.mesa.findMany({
			where: { numero: parseInt(args.mesa) },
		});

		where.mesaId = mesita[0] ?  mesita[0].id : -1;
	};
	return await prisma.pedido.findMany({
		where,
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

//Registra un pedido, validando que el estado de la mesa sea desocupado
async function registrarPedido(parent, args, { usuario, prisma }) {
	const mesa = await prisma.mesa.findOne({
		where: { id: parseInt(args.mesa) },
		select: { ocupado: true },
	});
	if (!mesa.ocupado) {
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
		const pedidoAgregado = await prisma.pedido
			.create({ data })
			.catch((err) => null);
		pubsub.publish(PEDIDO_AGREGADO, { pedidoAgregado });
		return pedidoAgregado;
	} else {
		throw new Error(MESA_OCUPADA);
	}
}

//Modifica el estado de un pedido
async function modificarPedido(parent, args, { prisma }) {
	return await prisma.pedido
		.update({
			where: { id: parseInt(args.id) },
			data: { estado: args.estado },
		})
		.catch((err) => null);
}

//Elimna un pedido, reuiqere del id del pedido
async function eliminarPedido(parent, { id }, { prisma }) {
	return await prisma.pedido
		.delete({ where: { id: parseInt(id) } })
		.catch((err) => null);
}

//Especificación de resolvers
export const Pedido = {
	pago,
	personal,
	mesa,
	productos,
};

export const Query = {
	listarPedido
};

export const Mutation = {
	registrarPedido,
	modificarPedido,
	eliminarPedido,
};

//Subscripción para datos en tiempo real
export const Subscription = {
	pedidoAgregado: {
		subscribe: withFilter(
			() => pubsub.asyncIterator([PEDIDO_AGREGADO]),
			(payload, variables) => {
				return (
					payload.pedidoAgregado.mesaId === parseInt(variables.mesaId)
				);
			}
		),
	},
};
