import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../models/user.model.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { JwtPayload } from '../types/jwt-payload.type.js';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),  // 👈 checks method-level @Roles() first
            context.getClass(),    // 👈 then checks controller-level @Roles()
        ]);

        // if no @Roles() decorator on the route, allow access
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: JwtPayload = request.user; // 👈 set by JwtAuthGuard

        if (!requiredRoles.includes(user.role as UserRole)) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}