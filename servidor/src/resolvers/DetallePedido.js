function getModel() {
	return {
		pedido: async function (parent, args, context) {
			return await context.prisma.insumoProducto
				.findOne({
					where: {
						productoId_pedidoId: {
							productoId: parent.productoId,
							pedidoId: parent.pedidoId,
						},
					},
				})
				.producto();
		},
		pedido: async (parent, args, context) => {
			return await context.prisma.detallePedido
				.findOne({ where: { id: parent.id } })
				.pedido();
		},
		producto: async function (parent, args, context) {
			return await context.prisma.insumoProducto
				.findOne({
					where: {
						productoId_pedidoId: {
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
}

module.exports = {
	getModel,
};
