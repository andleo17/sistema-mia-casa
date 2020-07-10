import { hash, compare } from 'bcryptjs';
import { APP_SECRET } from '../../utils/utils';
import { sign } from 'jsonwebtoken';
import {
	CLAVE_INCORRECTA,
	USUARIO_BANEADO,
	NO_ENCONTRADO,
	NO_ADMIN,
} from '../../utils/errors';

async function personal(parent, args, context) {
	return await context.prisma.credencial
		.findOne({ where: { id: parent.id } })
		.personal();
}

async function login(parent, args, context) {
	const usuario = await context.prisma.credencial.findOne({
		where: { usuario: args.usuario },
		include: { personal: true },
	});
	if (usuario) {
		if (usuario.estado) {
			const valido = await compare(args.clave, usuario.clave);
			if (valido) {
				return {
					token: sign(
						{
							id: usuario.id,
							rol: usuario.rol,
							cliente: context.usuario.cliente,
						},
						APP_SECRET
					),
					personal: usuario.personal,
				};
			} else {
				throw new Error(CLAVE_INCORRECTA);
			}
		} else {
			throw new Error(USUARIO_BANEADO);
		}
	} else {
		throw new Error(NO_ENCONTRADO('Usuario'));
	}
}

async function usuarioActual(parent, args, context) {
	const { id } = context.usuario;
	return await context.prisma.credencial
		.findOne({ where: { id } })
		.personal();
}

async function registrarCredencial(parent, args, context) {
	const { rol } = context.usuario;
	if (rol === 'ADMIN') {
		const clave = await hash(args.password, 10);
		const data = {
			...args,
			clave,
			personal: { connect: { id: parseInt(args.personal) } },
		};
		return await context.prisma.credencial
			.create({ data })
			.catch((err) => null);
	} else {
		throw new Error(NO_ADMIN);
	}
}

async function modificarCredencial(parent, args, context) {
	const { rol } = context.usuario;
	if (rol === 'ADMIN') {
		const data = {};
		if (args.usuario) data.usuario = args.usuario;
		if (args.clave) {
			const clave = await hash(args.clave, 10);
			data.clave = clave;
		}
		if (args.estado != null) data.estado = args.estado;
		return await context.prisma.credencial
			.update({
				where: { id: parseInt(args.id) },
				data,
			})
			.catch((err) => null);
	} else {
		throw new Error(NO_ADMIN);
	}
}

async function eliminarCredencial(parent, args, context) {
	const { rol } = context.usuario;
	if (rol === 'ADMIN') {
		return await context.prisma.credencial
			.delete({
				where: { id: parseInt(args.id) },
			})
			.catch((err) => null);
	} else {
		throw new Error(NO_ADMIN);
	}
}

export const Credencial = {
	personal,
};

export const Query = {
	login,
	usuarioActual,
};

export const Mutation = {
	registrarCredencial,
	modificarCredencial,
	eliminarCredencial,
};
