function getModel() {
	return {
		insumo: async (parent, args, context) => {
			return await context.prisma.detalleCompra
				.findOne({ where: { id: parent.id } })
				.insumo();
		},
		compra: async (parent, args, context) => {
			return await context.prisma.detalleCompra
				.findOne({ where: { id: parent.id } })
				.compra();
		},
	};
}

module.exports = {
	getModel,
};
