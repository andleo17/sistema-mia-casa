import { verify } from 'jsonwebtoken';
import { NO_LOGIN } from './errors';

export const APP_SECRET = 'sistema-mia-casa';

export function obtenerUsuario({ req }) {
	const authorization = req.get('Authorization');
	if (authorization) {
		const token = authorization.replace('Bearer ', '');
		const { usuarioId, rol } = verify(token, APP_SECRET);
		return { usuarioId, rol };
	}

	throw new Error(NO_LOGIN);
}
