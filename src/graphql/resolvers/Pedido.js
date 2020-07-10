import { obtenerUsuario } from '../../utils/utils';

async function pago(parent, args, context) {
	return await context.prisma.pedido
		.findOne({ where: { id: parent.id } })
		.pago();
}

async function personal(parent, args, context) {
	return await context.prisma.pedido
		.findOne({ where: { id: parent.id } })
		.personal();
}

async function mesa(parent, args, context) {
	return await context.prisma.pedido
		.findOne({ where: { id: parent.id } })
		.mesa();
}

async function productos(parent, args, context) {
	return await context.prisma.pedido
		.findOne({ where: { id: parent.id } })
		.productos();
}

async function listarPedido(parent, args, context) {
	return await context.prisma.pedido.findMany();
}

async function registrarPedido(parent, args, context) {
	const { id } = context.usuario;
	const data = {
		personal: { connect: { id } },
		mesa: { connect: { id: parseInt(args.mesa) } },
		productos: {
			create: args.productos.map((i) => {
				return {
					producto: { connect: { id: parseInt(i.producto) } },
					precio: i.precio,
					cantidad: i.cantidad,
				};
			}),
		},
	};

	return await context.prisma.pedido.create({ data }).catch((err) => null);
}

async function modificarPedido(parent, args, context) {
	const data = {};
	if (args.productos)
		data.productos = {
			create: args.productos.map((i) => {
				return {
					producto: { connect: { id: parseInt(i.producto) } },
					precio: i.precio,
					cantidad: i.cantidad,
					entregado: i.entregado,
					estado: i.estado,
				};
			}),
		};
	if (args.estado != null) estado = args.estado;
	if (args.mesa) mesa = { connect: { id: parseInt(args.mesa) } };
	return await context.prisma.pedido
		.update({
			where: { id: parseInt(args.id) },
			data,
		})
		.catch((err) => null);
}

async function eliminarPedido(parent, args, context) {
	const numeroPagos = await context.prisma.pago.count({
		where: { pedidoId: parseInt(args.id) },
	});
	if (numeroPagos == 0) {
		return await context.prisma.pedido
			.delete({ where: { id: parseInt(args.id) } })
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
