function getModel() {
	return {
		personal: (parent, args, context) => {
			return context.prisma.cargo
				.findOne({ where: { id: parent.id } })
				.personal();
		},
	};
}

function getQueries() {
	return {
		listarCargo: (parent, args, context) => {
			return context.prisma.cargo.findMany();
		},
	};
}

function getMutations() {
	return {
		registrarCargo: (parent, args, context) => {
			const data = {
				nombre: args.nombre,
			};
			return context.prisma.cargo.create({ data }).catch((err) => null);
		},
		modificarCargo: (parent, args, context) => {
			const data = {};
			if (args.nombre) data.nombre = args.nombre;
			if (args.estado != null) {
				data.estado = args.estado;
				if (data.estado == false) {
					data.personal = {
						updateMany: {
							where: {
								cargoId: parseInt(args.id),
							},
							data: { estado: false },
						},
					};
				}
			}
			return context.prisma.cargo
				.update({ where: { id: parseInt(args.id) }, data })
				.catch((err) => null);
		},
		eliminarCargo: (parent, args, context) => {
			const numeroPersonal = context.prisma.personal.count({
				where: { cargoId: parseInt(args.id) },
			});
			if (numeroPersonal == 0) {
				return context.prisma.cargo
					.delete({ where: { id: parseInt(args.id) } })
					.catch((err) => null);
			} else {
				return context.prisma.cargo.update({
					where: { id: parseInt(args.id) },
					data: {
						estado: false,
						personal: {
							updateMany: {
								where: { cargoId: parseInt(args.id) },
								data: { estado: false },
							},
						},
					},
				});
			}
		},
	};
}

module.exports = {
	getModel,
	getQueries,
	getMutations,
};
