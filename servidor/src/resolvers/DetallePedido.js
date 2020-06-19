function getModel() {
	return {
		pedido: async (parent, args, context) => {
			return await context.prisma.detallePedido
				.findOne({ where: { id: parent.id } })
				.pedido();
		},
		producto: async (parent, args, context) => {
			return await context.prisma.detallePedido
				.findOne({ where: { id: parent.id } })
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
