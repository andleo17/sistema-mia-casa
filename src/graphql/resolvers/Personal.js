export const Personal = {
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

export const Query = {
	listarPersonal: async (parent, args, context) => {
		return await context.prisma.personal.findMany();
	},
};

export const Mutation = {
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
		if (args.cargo) data.cargo = { connect: { id: parseInt(args.cargo) } };
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
	eliminarPersonal: async (parent, args, context) => {
		const numeroPedidos = await context.prisma.pedido.count({
			where: { personalId: parseInt(args.id) },
		});
		if (numeroPedidos == 0) {
			return await context.prisma.personal
				.delete({ where: { id: parseInt(args.id) } })
				.catch((err) => null);
		} else {
			return await context.prisma.personal.update({
				where: { id: parseInt(args.id) },
				data: {
					estado: false,
				},
			});
		}
	},
};
