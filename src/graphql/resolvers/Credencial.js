async function personal(parent, args, context) {
	return await context.prisma.credencial
		.findOne({ where: { id: parent.id } })
		.personal();
}

async function registrarCredencial(parent, args, context) {
	const data = {
		usuario: args.usuario,
		clave: args.clave,
		personal: { connect: { id: parseInt(args.personal) } },
	};
	return await context.prisma.credencial
		.create({ data })
		.catch((err) => null);
}

async function modificarCredencial(parent, args, context) {
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
}

async function eliminarCredencial(parent, args, context) {
	return await context.prisma.credencial
		.delete({
			where: { id: parseInt(args.id) },
		})
		.catch((err) => null);
}

export const Credencial = {
	personal,
};

export const Mutation = {
	registrarCredencial,
	modificarCredencial,
	eliminarCredencial,
};
