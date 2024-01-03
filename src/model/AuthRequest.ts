import { Request } from 'express';
import { AccessToken } from './Token';

export interface AuthRequest extends Request {
  token: AccessToken;
}
