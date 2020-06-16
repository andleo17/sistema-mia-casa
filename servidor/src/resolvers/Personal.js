function getModel() {
	return {
		cargo: async (parent, args, context) => {
			return await context.prisma.personal
				.findOne({ where: { id: parent.id } })
				.cargo();
		},
		credencial: async (parent, args, context) => {
			return await context.prisma.personal
				.findOne({ where: { id: parent.id } })
				.credencial();
		},
		pedidosAtendidos: async (parent, args, context) => {
			return await context.prisma.personal
				.findOne({ where: { id: parent.id } })
				.pedidosAtendidos();
		},
	};
}

function getQueries() {
	return {
		listarPersonal: async (parent, args, context) => {
			return await context.prisma.personal.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarPersonal: async (parent, args, context) => {
			const data = {
				nombres: args.nombres,
				apellidos: args.apellidos,
				sueldo: parseFloat(args.sueldo),
				cargo: { connect: { id: parseInt(args.cargo) } },
			};
			return await context.prisma.personal
				.create({ data })
				.catch((err) => null);
		},
		modificarPersonal: async (parent, args, context) => {
			const data = {};
			if (args.nombres) data.nombres = args.nombres;
			if (args.apellidos) data.apellidos = args.apellidos;
			if (args.sueldo) data.sueldo = parseFloat(args.sueldo);
			if (args.cargo)
				data.cargo = { connect: { id: parseInt(args.cargo) } };
			if (args.estado != null) {
				data.estado = args.estado;
				if (args.estado == false) {
					data.credencial = { update: { estado: false } };
				}
			}
			return await context.prisma.personal
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
