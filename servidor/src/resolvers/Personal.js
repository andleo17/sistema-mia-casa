function getModel() {
	return {
		cargo: (parent, args, context) => {
			return context.prisma.personal
				.findOne({ where: { id: parent.id } })
				.cargo();
		},
		credencial: (parent, args, context) => {
			return context.prisma.personal
				.findOne({ where: { id: parent.id } })
				.credencial();
		},
		pedidosAtendidos: (parent, args, context) => {
			return context.prisma.personal
				.findOne({ where: { id: parent.id } })
				.pedidosAtendidos();
		},
	};
}

function getQueries() {
	return {
		listarPersonal: (parent, args, context) => {
			return context.prisma.personal.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarPersonal: (parent, args, context) => {
			const data = {
				nombres: args.nombres,
				apellidos: args.apellidos,
				sueldo: parseFloat(args.sueldo),
				cargo: { connect: { id: parseInt(args.cargo) } },
			};
			return context.prisma.personal
				.create({ data })
				.catch((err) => null);
		},
		modificarPersonal: (parent, args, context) => {
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
			return context.prisma.personal
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