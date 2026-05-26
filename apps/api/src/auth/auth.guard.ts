import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly firebase: FirebaseService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new UnauthorizedException('Missing bearer token');
    const token = header.slice(7);
    const claims = await this.firebase.verifyToken(token);
    const user = await this.prisma.user.upsert({
      where: { firebaseUid: claims.uid },
      create: {
        firebaseUid: claims.uid,
        email: claims.email,
        name: claims.name,
        avatarUrl: claims.picture,
      },
      update: {
        email: claims.email,
        name: claims.name ?? undefined,
        avatarUrl: claims.picture ?? undefined,
      },
    });
    req.user = user;
    return true;
  }
}
