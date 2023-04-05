import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import {Reflector} from '@nestjs/core'
import { Observable } from 'rxjs';
import { Usuario } from 'src/entities';

@Injectable()
export class UserRoleGuard implements CanActivate {


    constructor(

        private readonly reflector: Reflector
    ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
      const  validRoles: string[] = this.reflector.get('roles', context.getHandler() )

      const req = context.switchToHttp().getRequest()
      const user = req.user as Usuario

      if (!user)
        throw new BadRequestException('Usuario no encontrado')

      for (const role of user.role) {
        if(validRoles.includes( role ))
        return true
      }

      throw new ForbiddenException(
        `El usuario ${user.nombre} ${user.apellido} necesita un rol valido: [${validRoles}]`
        )

  }
}
