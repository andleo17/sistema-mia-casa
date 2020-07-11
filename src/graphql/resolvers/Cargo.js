import { AuthenticationError } from 'apollo-server';
import { CAMPO_NO_ADMIN } from '../../utils/errors';

async function personal({ id }, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN')
		throw new AuthenticationError(CAMPO_NO_ADMIN('personal'));
	return await prisma.cargo.findOne({ where: { id } }).personal({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function listarCargo(parent, args, { prisma }) {
	return await prisma.cargo.findMany({
		where: { nombre: { contains: args.filtro } },
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
		orderBy: { id: 'asc' },
	});
}

async function registrarCargo(parent, args, { prisma }) {
	return await prisma.cargo
		.create({ data: { nombre: args.nombre } })
		.catch((err) => null);
}

async function modificarCargo(parent, args, { prisma }) {
	const data = { nombre: args.nombre, estado: args.estado };
	return await prisma.cargo
		.update({ where: { id: parseInt(args.id) }, data })
		.catch((err) => null);
}

async function eliminarCargo(parent, { id }, { prisma }) {
	const numeroPersonal = await prisma.personal.count({
		where: { cargoId: parseInt(id) },
	});
	if (numeroPersonal === 0) {
		return await prisma.cargo
			.delete({ where: { id: parseInt(id) } })
			.catch((err) => null);
	} else {
		return await prisma.cargo.update({
			where: { id: parseInt(id) },
			data: { estado: false },
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
