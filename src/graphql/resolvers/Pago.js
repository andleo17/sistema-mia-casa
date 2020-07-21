import { AuthenticationError } from 'apollo-server';
import { NO_ADMIN } from '../../utils/errors';

async function tipoPago(parent, { id }, { prisma }) {
	return await prisma.pago.findOne({ where: { id } }).tipoPago();
}

async function pedido(parent, { id }, { prisma }) {
	return await prisma.pago.findOne({ where: { id } }).pedido();
}

async function listarPago(parent, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN') throw new AuthenticationError(NO_ADMIN);
	return await prisma.pago.findMany({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

async function registrarPago(parent, args, { prisma }) {
	let serie = await prisma.queryRaw(`SELECT MAX("serie") FROM "Pago";`);
	serie = serie[0].max;
	let numero = await prisma.queryRaw(
		`SELECT MAX("numero") + 1 FROM "Pago" WHERE "serie" = ${serie};`
	);
	numero = numero[0].max;

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
	return await context.prisma.pago.create({ data }).catch((err) => err);
}

async function eliminarPago(parent, { id }, { prisma }) {
	return await prisma.pago
		.delete({ where: { id: parseInt(id) } })
		.catch((err) => null);
}

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
