async function cargo(parent, args, context) {
	return await context.prisma.personal
		.findOne({ where: { id: parent.id } })
		.cargo();
}

async function credencial(parent, args, context) {
	return await context.prisma.personal
		.findOne({ where: { id: parent.id } })
		.credencial();
}

async function pedidosAtendidos(parent, args, context) {
	return await context.prisma.personal
		.findOne({ where: { id: parent.id } })
		.pedidosAtendidos();
}

async function listarPersonal(parent, args, context) {
	return await context.prisma.personal.findMany();
}

async function registrarPersonal(parent, args, context) {
	const data = {
		nombres: args.nombres,
		apellidos: args.apellidos,
		sueldo: parseFloat(args.sueldo),
		cargo: { connect: { id: parseInt(args.cargo) } },
	};
	return await context.prisma.personal.create({ data }).catch((err) => null);
}

async function modificarPersonal(parent, args, context) {
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
}

async function eliminarPersonal(parent, args, context) {
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
}

export const Personal = {
	cargo,
	credencial,
	pedidosAtendidos,
};

export const Query = {
	listarPersonal,
};

export const Mutation = {
	registrarPersonal,
	modificarPersonal,
	eliminarPersonal,
};
