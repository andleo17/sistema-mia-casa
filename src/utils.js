import { verify } from 'jsonwebtoken';

export const APP_SECRET = 'sistema-mia-casa';

export function obtenerUsuario({ req }) {
	const authorization = req.get('Authorization');
	if (authorization) {
		const token = authorization.replace('Bearer ', '');
		return verify(token, APP_SECRET);
	}

	throw new Error('No autenticado');
}
