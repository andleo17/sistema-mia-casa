function getModel() {
	return {
		producto: async function (parent, args, context) {
			return await context.prisma.insumoProducto
				.findOne({
					where: {
						productoId_insumoId: {
							productoId: parent.productoId,
							insumoId: parent.insumoId,
						},
					},
				})
				.producto();
		},
		insumo: async function (parent, args, context) {
			return await context.prisma.insumoProducto
				.findOne({
					where: {
						productoId_insumoId: {
							productoId: parent.productoId,
							insumoId: parent.insumoId,
						},
					},
				})
				.insumo();
		},
	};
}

module.exports = {
	getModel,
};
