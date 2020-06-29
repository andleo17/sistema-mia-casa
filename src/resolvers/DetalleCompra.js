function getModel() {
	return {
		insumo: async (parent, args, context) => {
			return await context.prisma.detalleCompra
				.findOne({
					where: {
						insumoId_compraId: {
							insumoId: parent.insumoId,
							compraId: parent.compraId,
						},
					},
				})
				.insumo();
		},
		compra: async (parent, args, context) => {
			return await context.prisma.detalleCompra
				.findOne({
					where: {
						insumoId_compraId: {
							insumoId: parent.insumoId,
							compraId: parent.compraId,
						},
					},
				})
				.compra();
		},
	};
}

module.exports = {
	getModel,
};
