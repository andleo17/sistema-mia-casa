async function pedido(parent, args, context) {
	return await context.prisma.detallePedido
		.findOne({
			where: {
				pedidoId_productoId: {
					productoId: parent.productoId,
					pedidoId: parent.pedidoId,
				},
			},
		})
		.pedido();
}

async function producto(parent, args, context) {
	return await context.prisma.detallePedido
		.findOne({
			where: {
				pedidoId_productoId: {
					productoId: parent.productoId,
					pedidoId: parent.pedidoId,
				},
			},
		})
		.producto();
}

async function reclamos(parent, args, context) {
	return await context.prisma.detallePedido
		.findOne({ where: { id: parent.id } })
		.reclamos();
}

export const DetallePedido = {
	pedido,
	producto,
	reclamos,
};
