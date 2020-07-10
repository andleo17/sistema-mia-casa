async function insumo(parent, args, context) {
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
}

async function compra(parent, args, context) {
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
}

export const DetalleCompra = {
	insumo,
	compra,
};
