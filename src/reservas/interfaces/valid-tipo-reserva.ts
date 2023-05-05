
/**
 * Este enum utilizamos como una especie de interfaz para poder validar los tipos de reserva, esto significa que tiene 2 tipos: 
 * puesto: es para que se hagan reservas de un solo puesto,
 * y salaCompleta es para que se hagan reservas completas
 */
export enum ValidTipoReserva {
    puesto = 'Un puesto',
    salaCompleta = 'Sala Completa'
}