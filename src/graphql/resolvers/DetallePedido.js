export const DetallePedido = {
	pedido: async function (parent, args, context) {
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
	},
	producto: async function (parent, args, context) {
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
	},
	reclamos: async (parent, args, context) => {
		return await context.prisma.detallePedido
			.findOne({ where: { id: parent.id } })
			.reclamos();
	},
};
