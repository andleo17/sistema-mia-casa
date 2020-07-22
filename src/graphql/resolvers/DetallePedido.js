//Devuelve el pedido de un detalle de pedido
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

//Devuelve el producto de un pedido
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

//Devuelve los reclamos de un pedido
async function reclamos(parent, args, context) {
	return await context.prisma.detallePedido
		.findOne({
			where: {
				pedidoId_productoId: {
					pedidoId: parent.pedidoId,
					productoId: parent.productoId,
				},
			},
		})
		.reclamos();
}

//Especificación de resolvers
export const DetallePedido = {
	pedido,
	producto,
	reclamos,
};
