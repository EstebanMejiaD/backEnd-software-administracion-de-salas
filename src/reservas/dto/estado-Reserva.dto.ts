import { IsNotEmpty, IsNumber, IsString } from 'class-validator';



export class EstadoReservaDto  {

    @IsNumber()
    @IsNotEmpty({message: 'el estado de validacion no puede estar vacío'})
    ValidestadoReserva: number
}