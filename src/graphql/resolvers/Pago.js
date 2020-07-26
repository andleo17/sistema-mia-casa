//Importaciones de nombres de estapcio
import { AuthenticationError } from 'apollo-server';
import { NO_ADMIN } from '../../utils/errors';

//Lista los tipos de pagos aceptados por el restaurante
async function tipoPago({ id }, args, { prisma }) {
	return await prisma.pago.findOne({ where: { id } }).tipoPago();
}

//Lista el pago de un pedido
async function pedido({ id }, args, { prisma }) {
	return await prisma.pago.findOne({ where: { id } }).pedido();
}

//Lista todos los pagos, corroborando que el usuario que ha iniciado sesión tenga rol ADMIN
async function listarPago(parent, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN') throw new AuthenticationError(NO_ADMIN);
	return await prisma.pago.findMany({
		where: {
			id: parseInt(args.id) || undefined,
		},
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

//Registra el pago de un pedido, generando automaticamente la serie y el número del mismo
async function registrarPago(parent, args, { prisma }) {
	let serie = await prisma.queryRaw(
		`SELECT MAX("serie") AS "serie" FROM "Pago";`
	);
	serie = serie[0].serie || 1;
	let numero = await prisma.queryRaw(
		`SELECT MAX("numero") + 1 AS "numero" FROM "Pago" WHERE "serie" = ${serie};`
	);
	numero = numero[0].numero || 1;

	if (numero === 1000000) {
		serie++;
		numero = 1;
	}

	const data = {
		serie,
		numero,
		monto: parseFloat(args.monto),
		tipoPago: { connect: { id: parseInt(args.tipoPago) } },
		pedido: { connect: { id: parseInt(args.pedido) } },
	};
	return await prisma.pago.create({ data }).catch((err) => err);
}

//Elimna un pago
async function eliminarPago(parent, { id }, { prisma }) {
	return await prisma.pago
		.delete({ where: { id: parseInt(id) } })
		.catch((err) => null);
}

//Especificación de resolvers
export const Pago = {
	tipoPago,
	pedido,
};

export const Query = {
	listarPago,
};

export const Mutation = {
	registrarPago,
	eliminarPago,
};
