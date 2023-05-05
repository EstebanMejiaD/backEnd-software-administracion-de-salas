
/**
 * Este enum utilizamos como una especie de interfaz para poder validar los estados de las reservas, esto significa que tiene 3 estados: 
 * pendiente: que es cuando la reserva está solicitada.
 * aceptado: que es cuando la reserva ha sido aceptada por un usuario administrador y la sala pasará a estar de una manera u otra
 * y el rechazado: que es cuando la reserva ha sido rechazada por un usuario administrador y no modificará nada de la sala
 */


export enum ValidEstadoReserva {
    pendiente = 'pendiente',
    aceptado = 'aceptado',
    rechazado = 'rechazado',
}

