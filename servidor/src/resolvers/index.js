const Cargo = require('./Cargo');
const Credencial = require('./Credencial');
const Personal = require('./Personal');
const TipoProducto = require("./TipoProducto");
const Producto = require("./Producto");
const Insumo = require("./Insumo");
const Mesa = require("./Mesa");
const Pago = require("./Pago");
const TipoPago = require("./TipoPago");
const Pedido = require("./Pedido");
const Compra = require("./Compra");
const DetalleCompra = require("./DetalleCompra");
const DetallePedido = require("./DetallePedido");
const Reclamo = require("./Reclamo");

module.exports = {
	Cargo: Cargo.getModel(),
	Credencial: Credencial.getModel(),
	Personal: Personal.getModel(),
	TipoProducto: TipoProducto.getModel(),
	Producto: Producto.getModel(),
	Insumo: Insumo.getModel(),
	Mesa: Mesa.getModel(),
	Pago: Pago.getModel(),
	TipoPago: TipoPago.getModel(),
	Pedido: Pedido.getModel(),
	Compra: Compra.getModel(),
	DetalleCompra: DetalleCompra.getModel(),
	DetallePedido: DetallePedido.getModel(),
	Reclamo: Reclamo.getModel(),
	Query: {
		...Cargo.getQueries(),
		...Personal.getQueries(),
		...TipoProducto.getQueries(),
		...Producto.getQueries(),
		...Insumo.getQueries(),
		...Mesa.getQueries(),
		...Pago.getQueries(),
		...TipoPago.getQueries(),
		...Pedido.getQueries(),
		...Compra.getQueries(),
		...Reclamo.getQueries(),
	},
	Mutation: {
		...Cargo.getMutations(),
		...Credencial.getMutations(),
		...Personal.getMutations(),
		...TipoProducto.getMutations(),
		...Producto.getMutations(),
		...Insumo.getMutations(),
		...Mesa.getMutations(),
		...Pago.getMutations(),
		...TipoPago.getMutations(),
		...Pedido.getMutations(),
		...Compra.getMutations(),
		...Reclamo.getMutations(),
	},
};
