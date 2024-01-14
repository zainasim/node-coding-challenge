// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SignUpDto } from '../users/dto/signup.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // No specific roles required for this route
    }

    const request = context.switchToHttp().getRequest();
    const user: SignUpDto = request.user;

    return user && requiredRoles.includes(user.role);
  }
}
