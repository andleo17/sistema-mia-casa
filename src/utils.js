import { verify } from 'jsonwebtoken';

export const APP_SECRET = 'sistema-mia-casa';

export function obtenerUsuarioId(context) {
	const authorization = context.request.get('Authorization');
	if (authorization) {
		const token = Authorization.replace('Bearer ', '');
		const { usuarioId } = verify(token, APP_SECRET);
		return usuarioId;
	}

	throw new Error('Not authenticated');
}
