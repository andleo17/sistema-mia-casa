import { hash } from 'bcryptjs';
import { obtenerUsuario, APP_SECRET } from '../../utils';
import { sign } from 'jsonwebtoken';

async function personal(parent, args, context) {
	return await context.prisma.credencial
		.findOne({ where: { id: parent.id } })
		.personal();
}

async function login(parent, args, context) {
	const usuario = await context.prisma.credencial.findOne({
		where: { usuario: args.usuario },
	});
	if (usuario) {
		const valido = args.clave === usuario.clave;
		if (valido) {
			return {
				token: sign(
					{ usuarioId: usuario.id, rol: usuario.rol },
					APP_SECRET
				),
				credencial: usuario,
			};
		} else {
			throw new Error('Contraseña inválida.');
		}
	} else {
		throw new Error('Usuario no encontrado.');
	}
}

async function registrarCredencial(parent, args, context) {
	const { rol } = obtenerUsuario(context);
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
		throw new Error('No tiene permiso de administrador.');
	}
}

async function modificarCredencial(parent, args, context) {
	const { rol } = obtenerUsuario(context);
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
		throw new Error('No tiene permiso de administrador.');
	}
}

async function eliminarCredencial(parent, args, context) {
	const { rol } = obtenerUsuario(context);
	if (rol === 'ADMIN') {
		return await context.prisma.credencial
			.delete({
				where: { id: parseInt(args.id) },
			})
			.catch((err) => null);
	} else {
		throw new Error('No tiene permiso de administrador.');
	}
}

export const Credencial = {
	personal,
};

export const Query = {
	login,
};

export const Mutation = {
	registrarCredencial,
	modificarCredencial,
	eliminarCredencial,
};
