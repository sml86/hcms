import { createCipheriv, createDecipheriv } from 'crypto';
import { User, AccessToken, OAuthGrant } from '../model';

const ALG = 'aes-256-gcm';
const PEPPER = 'cA2wfjE$Gfn.nFe3-G6zc+s(A5Fj.90a';
const SALT = process.env.OAUTH_SALT || '3j8I/dJH4Kkjß38-3jd&GS';
const LIFETIME = parseInt(process.env.OAUTH_REFRESH_TOKEN_LIFETIME || '1800');
const ISSUER = process.env.OAUTH_ISSUER || 'hcms';

export function generateRefreshToken(type: OAuthGrant, email?: string) {
  const expires = getNumericDate(LIFETIME);
  const content = JSON.stringify([type, expires, email]);
  const cipher = createCipheriv(ALG, Buffer.from(PEPPER), Buffer.from(SALT), { authTagLength: 4 });
  const crypted = Buffer.concat([cipher.update(content, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag().toString('hex');
  return authTag + crypted.toString('hex') + '-R';
}

export function verifyRefreshToken(token: string): RefreshTokenFormat {
  if (!token.endsWith('-R')) throw new RefreshTokenFormatError();
  const buffer = Buffer.from(token, 'hex');
  const decipher = createDecipheriv(ALG, Buffer.from(PEPPER), Buffer.from(SALT));
  const authTag = buffer.subarray(0, 4);
  decipher.setAuthTag(authTag);
  const tok = buffer.subarray(4);
  const decrypted = Buffer.concat([decipher.update(tok), decipher.final()]);
  const [type, expires, email] = JSON.parse(decrypted.toString('utf8')) as RefreshTokenFormat;
  if (getNumericDate() > expires) throw new RefreshTokenInvalidError();
  return [type, expires, email];
}

export function generateAccessToken(type: OAuthGrant, scopes: string[], user?: User): AccessToken {
  return { iss: ISSUER, exp: getNumericDate(600), iat: getNumericDate(), type, scopes, user };
}

export function getNumericDate(addSeconds?: number) {
  const num = Math.round(new Date().getTime() / 1000);
  return addSeconds ? num + addSeconds : num;
}

export class RefreshTokenFormatError extends Error {}
export class RefreshTokenInvalidError extends Error {}

export type RefreshTokenFormat = [OAuthGrant, number, string?];
