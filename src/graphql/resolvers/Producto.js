//Importación de nombres de espacio
import { AuthenticationError } from 'apollo-server';
import { NO_ADMIN } from '../../utils/errors';

//Devuelve el tipo de producto de un producto
async function tipoProducto({ id }, args, { prisma }) {
	return await prisma.producto.findOne({ where: { id } }).tipoProducto();
}

//Devuelve los productos de un pedido
async function pedidosRealizados({ id }, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN') throw new AuthenticationError(NO_ADMIN);
	return await prisma.producto.findOne({ where: { id } }).pedidosRealizados();
}

//Devuelve la lista de insumos de un producto
async function receta({ id }, args, { prisma }) {
	return await prisma.producto.findOne({ where: { id } }).receta({
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
	});
}

//Devuelva una lista de productos
async function listarProducto(parent, args, { usuario, prisma }) {
	const where = { nombre: { contains: args.filtro } };
	if (usuario.rol !== 'ADMIN') where.estado = true;
	return await prisma.producto.findMany({
		where,
		skip: (args.pagina - 1) * args.cantidad || undefined,
		take: args.cantidad,
		orderBy: { id: 'asc' },
	});
}

//Permite registra un producto
async function registrarProducto(parent, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN') throw new AuthenticationError(NO_ADMIN);
	const data = {
		nombre: args.nombre,
		descripcion: args.descripcion,
		cantidad: parseInt(args.cantidad),
		precio: parseFloat(args.precio),
		imagen: args.imagen,
		estado: args.estado,
		tipoProducto: { connect: { id: parseInt(args.tipoProducto) } },
		receta: {
			create: args.receta.map((i) => {
				return {
					cantidad: parseFloat(i.cantidad),
					unidad: i.unidad,
					insumo: { connect: { id: parseInt(i.insumo) } },
				};
			}),
		},
	};
	return await prisma.producto.create({ data }).catch((err) => null);
}

//Permite modificar un producto y sus insumos
async function modificarProducto(parent, args, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN') throw new AuthenticationError(NO_ADMIN);
	const data = {}
		if(args.nombre) data.nombre = args.nombre;
		if(args.descripcion) data.descripcion = args.descripcion;
		if(args.cantidad) data.cantidad = parseInt(args.cantidad);
		if(args.precio) data.precio = parseFloat(args.precio);
		if(args.imagen) data.imagen = args.imagen;
		if(args.estado != null) data.estado = args.estado;
		if(args.tipoProducto) data.tipoProducto = { connect: { id: parseInt(args.tipoProducto) } };

	return await prisma.producto
		.update({
			where: { id: parseInt(args.id) },
			data,
		})
		.catch((err) => null);
}

//Elimina un producto y sus insumos
async function eliminarProducto(parent, { id }, { usuario, prisma }) {
	if (usuario.rol !== 'ADMIN') throw new AuthenticationError(NO_ADMIN);
	const numeroPedidos = await prisma.detallePedido.count({
		where: { productoId: parseInt(id) },
	});
	if (numeroPedidos === 0) {
		await prisma.insumoProducto
			.deleteMany({ where: { productoId: parseInt(id) }})
			.catch((err) => err);

		return await prisma.producto
			.delete({ where: { id: parseInt(id) } })
			.catch((err) => err);
	} else {
		return await prisma.producto
			.update({
				where: { id: parseInt(id) },
				data: { estado: false },
			})
			.catch((err) => null);
	}
}

//Especificación de resolvers
export const Producto = {
	tipoProducto,
	pedidosRealizados,
	receta,
};

export const Query = {
	listarProducto,
};

export const Mutation = {
	registrarProducto,
	modificarProducto,
	eliminarProducto,
};
