

/**
 * Este enum utilizamos como una especie de interfaz para poder validar los estados de las salas, esto significa que tiene 3 estados: 
 * disponible: que es cuando la sala está totalmente disponible.
 * parcial o parcial-ocupado: que es cuando la sala está parcialmente ocupada es decir que por menos 1 puesto está reservado y no se pueden hacer reservas totales 
 * y el Total ó total-ocupado: es cuando la sala ha sido reservada por un docente y está totalmente ocupada, no se pueden hacer más reservas de ningún tipo
 */
export enum ValidEstadoSala {
    disponible = 'disponible',
    parcial = 'parcial-ocupado',
    total = 'total-ocupado',
}