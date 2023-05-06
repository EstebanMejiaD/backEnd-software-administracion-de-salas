import { IsString, MinLength, IsNotEmpty, IsEmail, Matches, IsNumber, IsOptional, IsUUID, IsArray} from 'class-validator'
import { ValidRoles } from '../interfaces'

export class CreateUsuarioSuperiorDto {


    @IsString({message: 'El nombre debe ser una cadena de texto'})
    @MinLength(3, {message: 'El nombre debe tener al menos 3 caracteres' })
    @IsNotEmpty({message: 'El nombre no puede ser vacío'})
    nombre: string


    @IsString({message: 'El apellido debe ser una cadena de texto'})
    @MinLength(3, {message: 'El apellido debe tener al menos 3 caracteres' })
    @IsNotEmpty({message: 'El apellido no puede ser vacío'})
    apellido: string


    @IsString({message: 'El email debe ser una cadena de texto'})
    @MinLength(3, {message: 'El email debe tener al menos 3 caaracteres' })
    @IsEmail({},{message: 'El correo debe ser un correo valido'})
    @IsNotEmpty({message: 'El email no puede ser vacío'})
    email: string

    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, { message: 'La contraseña debe tener al menos una letra mayúscula, una minúscula y un número' })
    contraseña: string



    @IsNumber({}, {message: 'El documento debe ser un numero'})
    @IsNotEmpty({ message: 'El documento no puede estar vacío' })
    documento: number

    // // esta es la relacion con la tabla tipo de documento es decir se le pasa el uuid de el tipo de documento fijo
    @IsString()
    @IsUUID()
    tipoDocumento: string


    @IsArray({message: 'El role debe ser una array de strings'})
    role: string[]

    // // esta es la relacion con la tabla tipo de usuario es decir se le pasa el uuid de el tipo de ususario fijo: estudiante, docentes y administradores de salas
    // tipoUsuario: string

    // solo los super-administradores pueden modificar el estado
    // @IsOptional()
    // estado?: boolean

}
