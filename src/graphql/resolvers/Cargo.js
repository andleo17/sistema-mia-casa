async function personal(parent, args, context) {
	return await context.prisma.cargo
		.findOne({ where: { id: parent.id } })
		.personal();
}

async function listarCargo(parent, args, context) {
	return await context.prisma.cargo.findMany();
}

async function registrarCargo(parent, args, context) {
	const data = {
		nombre: args.nombre,
	};
	return await context.prisma.cargo.create({ data }).catch((err) => null);
}

async function modificarCargo(parent, args, context) {
	const data = {};
	if (args.nombre) data.nombre = args.nombre;
	if (args.estado != null) {
		data.estado = args.estado;
		if (data.estado == false) {
			data.personal = {
				updateMany: {
					where: {
						cargoId: parseInt(args.id),
					},
					data: { estado: false },
				},
			};
		}
	}
	return await context.prisma.cargo
		.update({ where: { id: parseInt(args.id) }, data })
		.catch((err) => null);
}

async function eliminarCargo(parent, args, context) {
	const numeroPersonal = await context.prisma.personal.count({
		where: { cargoId: parseInt(args.id) },
	});
	if (numeroPersonal == 0) {
		return await context.prisma.cargo
			.delete({ where: { id: parseInt(args.id) } })
			.catch((err) => null);
	} else {
		return await context.prisma.cargo.update({
			where: { id: parseInt(args.id) },
			data: {
				estado: false,
				personal: {
					updateMany: {
						where: { cargoId: parseInt(args.id) },
						data: { estado: false },
					},
				},
			},
		});
	}
}

export const Cargo = {
	personal,
};

export const Query = {
	listarCargo,
};

export const Mutation = {
	registrarCargo,
	modificarCargo,
	eliminarCargo,
};
