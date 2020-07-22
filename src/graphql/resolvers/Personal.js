import { AuthenticationError } from 'apollo-server';
import { NO_ADMIN } from '../../utils/errors';

async function cargo({ id }, args, { prisma }) {
	return await prisma.personal.findOne({ where: { id } }).cargo();
}

async function credencial({ id }, args, { prisma }) {
	return await prisma.personal.findOne({ where: { id } }).credencial();
}

async function pedidosAtendidos({ id }, args, { prisma }) {
	return await prisma.personal.findOne({ where: { id } }).pedidosAtendidos({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function listarPersonal(parent, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN') throw new AuthenticationError(NO_ADMIN);
	return await prisma.personal.findMany({
		where: {
			OR: [
				{ nombres: { contains: args.filtro } },
				{ apellidos: { contains: args.filtro } },
			],
		},
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function registrarPersonal(parent, args, { prisma }) {
	return await prisma.personal
		.create({
			data: {
				nombres: args.nombres,
				apellidos: args.apellidos,
				sueldo: parseFloat(args.sueldo),
				cargo: { connect: { id: parseInt(args.cargo) } },
			},
		})
		.catch((err) => err);
}

async function modificarPersonal(parent, args, { prisma }) {
	return await prisma.personal
		.update({
			where: { id: parseInt(args.id) },
			data: {
				nombres: args.nombres,
				apellidos: args.apellidos,
				sueldo: args.sueldo,
				cargo: { connect: { id: args.cargo } },
				estado: args.estado,
			},
		})
		.catch((err) => null);
}

async function eliminarPersonal(parent, { id }, { prisma }) {
	const numeroPedidos = await prisma.pedido.count({
		where: { personalId: parseInt(id) },
	});
	if (numeroPedidos == 0) {
		return await prisma.personal
			.delete({ where: { id: parseInt(id) } })
			.catch((err) => null);
	} else {
		return await prisma.personal.update({
			where: { id: parseInt(id) },
			data: { estado: false },
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
