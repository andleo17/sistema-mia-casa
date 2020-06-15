const Cargo = require('./Cargo');
const Credencial = require('./Credencial');
const Personal = require('./Personal');

module.exports = {
	Cargo: Cargo.getModel(),
	Credencial: Credencial.getModel(),
	Personal: Personal.getModel(),
	Query: {
		...Cargo.getQueries(),
		...Personal.getQueries(),
	},
	Mutation: {
		...Cargo.getMutations(),
		...Credencial.getMutations(),
		...Personal.getMutations(),
	},
};
