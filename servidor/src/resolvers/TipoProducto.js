function getModel() {
	return {
		productos: (parent, args, context) => {
			return context.prisma.tipoProducto
				.findOne({ where: { id: parent.id } })
				.productos();
		},
	};
}

function getQueries() {
	return {
		listarTipoProducto: (parent, args, context) => {
			return context.prisma.tipoProducto.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarTipoProducto: (parent, args, context) => {
			const data = {
				nombre: args.nombre,
			};
			return context.prisma.tipoProducto.create({ data }).catch((err) => null);
		},
		modificarTipoProducto: (parent, args, context) => {
			const data = {};
			if (args.nombre) data.nombre = args.nombre;
			return context.prisma.tipoProducto
				.update({
					where: { id: parseInt(args.id) },
					data,
				})
				.catch((err) => null);
		},
		eliminarPersonal: (parent, args, context) => {
			// TODO: Agregar lógica para eliminar a un personal.
		},
	};
}

module.exports = {
	getModel,
	getQueries,
	getMutations,
};
