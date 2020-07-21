export const NO_LOGIN = 'No ha iniciado sesión.';
export const NO_ADMIN = 'No tiene permiso de administrador.';
export const CLAVE_INCORRECTA = 'Contraseña inválida.';
export const CLIENTE_DESCONOCIDO = 'Cliente desconocido';
export const USUARIO_BANEADO = 'Usuario baneado.';
export function NO_ENCONTRADO(tabla) {
	return `${tabla} no encontrado(a).`;
}
export function CAMPO_NO_ADMIN(campo) {
	return `No se puede acceder al campo ${campo} porque no es administrador.`;
}
export const MESA_OCUPADA =
	'Mesa ocupada, no se puede registrar un nuevo pedido';
