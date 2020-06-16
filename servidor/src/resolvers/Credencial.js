function getModel() {
	return {
		personal: async (parent, args, context) => {
			return await context.prisma.credencial
				.findOne({ where: { id: parent.id } })
				.personal();
		},
	};
}

function getMutations() {
	return {
		registrarCredencial: async (parent, args, context) => {
			const data = {
				usuario: args.usuario,
				clave: args.clave,
				personal: { connect: { id: parseInt(args.personal) } },
			};
			return await context.prisma.credencial
				.create({ data })
				.catch((err) => null);
		},
		modificarCredencial: async (parent, args, context) => {
			const data = {};
			if (args.usuario) data.usuario = args.usuario;
			if (args.clave) data.clave = args.clave;
			if (args.estado != null) data.estado = args.estado;
			return await context.prisma.credencial
				.update({
					where: { id: parseInt(args.id) },
					data,
				})
				.catch((err) => null);
		},
		eliminarCredencial: async (parent, args, context) => {
			return await context.prisma.credencial
				.delete({
					where: { id: parseInt(args.id) },
				})
				.catch((err) => null);
		},
	};
}

module.exports = {
	getModel,
	getMutations,
};
