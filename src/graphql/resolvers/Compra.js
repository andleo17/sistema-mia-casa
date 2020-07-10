async function insumos(parent, args, context) {
	return await context.prisma.compra
		.findOne({ where: { id: parent.id } })
		.insumos();
}

async function listarCompra(parent, args, context) {
	return await context.prisma.compra.findMany();
}

async function registrarCompra(parent, args, context) {
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
	return await context.prisma.compra.create({ data }).catch((err) => null);
}

async function modificarCompra(parent, args, context) {
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
}

async function eliminarCompra(parent, args, context) {
	return null;
	// TODO: Se puede eliminar una compra?
}

export const Compra = {
	insumos,
};

export const Query = {
	listarCompra,
};

export const Mutation = {
	registrarCompra,
	modificarCompra,
	eliminarCompra,
};
