import { IsString, MinLength, IsNotEmpty, IsEmail, Matches, IsNumber, IsOptional, IsUUID} from 'class-validator'

export class LoginUsuarioDto {




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



}
