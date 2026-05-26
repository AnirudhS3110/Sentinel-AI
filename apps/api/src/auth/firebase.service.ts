import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export interface FirebaseUserClaims {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private initialized = false;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const projectId = this.config.get<string>('firebase.projectId');
    const clientEmail = this.config.get<string>('firebase.clientEmail');
    const privateKey = this.config.get<string>('firebase.privateKey');
    if (!projectId || !clientEmail || !privateKey) return;
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
    }
    this.initialized = true;
  }

  async verifyToken(token: string): Promise<FirebaseUserClaims> {
    if (!this.initialized) {
      // Dev fallback: decode JWT payload without verification when Firebase is not configured
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
      return {
        uid: payload.user_id ?? payload.sub ?? 'dev-user',
        email: payload.email ?? 'dev@sentinel.local',
        name: payload.name,
        picture: payload.picture,
      };
    }
    const decoded = await admin.auth().verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email ?? `${decoded.uid}@firebase.local`,
      name: decoded.name,
      picture: decoded.picture,
    };
  }
}
