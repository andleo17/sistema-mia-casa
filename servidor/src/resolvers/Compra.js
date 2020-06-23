function getModel() {
	return {
		insumos: async (parent, args, context) => {
			return await context.prisma.compra
				.findOne({ where: { id: parent.id } })
				.insumos();
		},
	};
}

function getQueries() {
	return {
		listarCompra: async (parent, args, context) => {
			return await context.prisma.compra.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarCompra: async (parent, args, context) => {
			const data = {
				serie: args.serie,
				numero: args.numero,
				precio: args.precio,
				fecha: args.fecha,
				insumos: {
					create: args.insumos.map((i) => {
						return {
							importe: parseFloat(i.importe),
							cantidad: parseFloat(i.cantidad),
							unidad: i.unidad,
							insumo: {
								connect: { id: parseInt(i.insumo) },
							},
						};
					}),
				},
			};
			return await context.prisma.compra
				.create({ data })
				.catch((err) => null);
		},
		modificarCompra: async (parent, args, context) => {
			const data = {};
			if (args.serie) serie = args.serie;
			if (args.numero) numero = args.numero;
			if (args.precio) precio = args.precio;
			if (args.fecha) fecha = args.fecha;
			// TODO: Realizar lógica para actualizar insumos de una compra
			// if (args.insumos)
			// 	insumos = {
			// 		upsert: args.insumos.map((i) => {
			// 			return {
			// 				importe: parseFloat(i.importe),
			// 				cantidad: parseFloat(i.cantidad),
			// 				unidad: i.unidad,
			// 				insumo: {
			// 					connect: { id: parseInt(i.insumo) },
			// 				},
			// 			};
			// 		}),
			// 	};
			return await context.prisma.compra
				.update({
					where: { id: parseInt(args.id) },
					data,
				})
				.catch((err) => null);
		},
		eliminarCompra: async (parent, args, context) => {
			return null;
		},
	};
}

module.exports = {
	getModel,
	getQueries,
	getMutations,
};
