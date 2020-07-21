import { verify } from 'jsonwebtoken';
import { NO_LOGIN, CLIENTE_DESCONOCIDO } from './errors';
import { AuthenticationError } from 'apollo-server';

export const APP_SECRET = 'sistema-mia-casa';

export function obtenerUsuario(authorization) {
	if (authorization) {
		const token = authorization.replace('Bearer ', '');
		const { id, rol, cliente } = verify(token, APP_SECRET);
		if (cliente) {
			return { id, rol, cliente };
		} else {
			throw new Error(CLIENTE_DESCONOCIDO);
		}
	}

	throw new AuthenticationError(NO_LOGIN);
}
