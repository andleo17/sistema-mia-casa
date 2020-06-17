const Cargo = require('./Cargo');
const Credencial = require('./Credencial');
const Personal = require('./Personal');
const TipoProducto = require("./TipoProducto");
const Producto = require("./Producto");
const Insumo = require("./Insumo");

module.exports = {
	Cargo: Cargo.getModel(),
	Credencial: Credencial.getModel(),
	Personal: Personal.getModel(),
	TipoProducto: TipoProducto.getModel(),
	Producto: Producto.getModel(),
	Insumo: Insumo.getModel(),
	Query: {
		...Cargo.getQueries(),
		...Personal.getQueries(),
		...TipoProducto.getQueries(),
		...Producto.getQueries(),
		...Insumo.getQueries(),
	},
	Mutation: {
		...Cargo.getMutations(),
		...Credencial.getMutations(),
		...Personal.getMutations(),
		...TipoProducto.getMutations(),
		...Producto.getMutations(),
		...Insumo.getMutations(),
	},
};
