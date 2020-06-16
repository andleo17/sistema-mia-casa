const Cargo = require('./Cargo');
const Credencial = require('./Credencial');
const Personal = require('./Personal');
const TipoProducto = require("./TipoProducto");

module.exports = {
	Cargo: Cargo.getModel(),
	Credencial: Credencial.getModel(),
	Personal: Personal.getModel(),
	TipoProducto: TipoProducto.getModel(),
	Query: {
		...Cargo.getQueries(),
		...Personal.getQueries(),
		...TipoProducto.getQueries(),
	},
	Mutation: {
		...Cargo.getMutations(),
		...Credencial.getMutations(),
		...Personal.getMutations(),
		...TipoProducto.getMutations(),
	},
};
