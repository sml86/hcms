import { NextFunction, Response, Request } from 'express';
import { Authentication, HttpError, HttpStatus, MimeType } from 'httpepper';
import { Pool } from 'pg';
import { generateAccessToken, generateRefreshToken, getNumericDate, verifyRefreshToken } from '../utils/oauth';
import { sign, verify } from 'jsonwebtoken';
import { User, UserResult, selectUserSql, transformUserResult, OAuthGrant, OAuthParam, OAuthResponse, AccessToken } from '../model';
import { AuthRequest } from '../model/AuthRequest';

const JWT_KEY = 'dfj73b.Bgsid-ah%3re$foho3JD#jH,jhs';
const ADMIN_SCOPE = 'administrator.all';

export function handleAuthentication(request: Request, response: Response, next: NextFunction) {
  try {
    if (request.headers.authorization && request.path === '/login') return next();
    if (request.path === '/oauth/token') return next();
    if (!request.headers.authorization) throw new HttpError(HttpStatus.Unauthorized);
    const bearer = Authentication.getBearerToken(request.headers.authorization);
    (request as AuthRequest).token = verify(bearer, JWT_KEY) as AccessToken;
    next();
  } catch (error) {
    next(error);
  }
}

export async function handleLogin(request: Request, response: Response<OAuthResponse>, next: NextFunction) {
  try {
    if (!request.headers.authorization) throw new HttpError(HttpStatus.Unauthorized);
    const { username, password } = Authentication.getBasicCredentials(request.headers.authorization);
    const pool: Pool = request.app.locals.pool;
    const sql = `${selectUserSql} WHERE email=$1 AND password=MD5($2)`;
    const result = await pool.query<UserResult>(sql, [username, password]);
    if (!result.rows.length) throw new HttpError(HttpStatus.Unauthorized);
    const user = transformUserResult(result.rows[0]);
    return response
      .status(HttpStatus.OK)
      .type(MimeType.JSON)
      .send({
        access_token: sign(generateAccessToken(OAuthGrant.UserLogin, user.scopes, user), JWT_KEY),
        user_token: sign(user, JWT_KEY),
        expires: getNumericDate(600) * 1000,
        refresh_token: generateRefreshToken(OAuthGrant.UserLogin, user.email),
      });
  } catch (error) {
    return next(error);
  }
}

export async function handleOAuth(request: Request, response: Response<OAuthResponse>, next: NextFunction) {
  try {
    const grantType = request.body[OAuthParam.GrantType];
    if (grantType !== OAuthGrant.ClientCredentials && grantType !== OAuthGrant.RefreshToken) throw new HttpError(HttpStatus.BadRequest);
    if (grantType === OAuthGrant.ClientCredentials) {
      if (!request.headers.authorization) throw new HttpError(HttpStatus.Unauthorized);
      const { username, password } = Authentication.getBasicCredentials(request.headers.authorization);
      if (username === process.env.OAUTH_CLIENTID && password === process.env.OAUTH_CLIENTSECRET)
        return response
          .status(HttpStatus.OK)
          .type(MimeType.JSON)
          .send({
            access_token: sign(generateAccessToken(OAuthGrant.ClientCredentials, [ADMIN_SCOPE]), JWT_KEY),
            refresh_token: generateRefreshToken(OAuthGrant.ClientCredentials),
            expires: getNumericDate(60) * 1000,
          });
      else throw new HttpError(HttpStatus.Forbidden);
    }
    if (grantType === OAuthGrant.RefreshToken) {
      if (!request.body[OAuthParam.RefreshToken]) throw new HttpError(HttpStatus.Unauthorized);
      const [type, exp, email] = verifyRefreshToken(request.body[OAuthParam.RefreshToken]);
      let user_token: string | undefined = undefined;
      let user: User | undefined = undefined;
      let scopes = [ADMIN_SCOPE];
      if (type === OAuthGrant.UserLogin && email) {
        const pool: Pool = request.app.locals.pool;
        const sql = `${selectUserSql} WHERE email=$1`;
        const result = await pool.query<UserResult>(sql, [email]);
        if (!result.rows.length) throw new HttpError(HttpStatus.Unauthorized);
        user = transformUserResult(result.rows[0]);
        user_token = sign(user, JWT_KEY);
        scopes = user.scopes;
      }
      return response
        .status(HttpStatus.OK)
        .type(MimeType.JSON)
        .send({
          access_token: sign(generateAccessToken(type, scopes, user), JWT_KEY),
          user_token,
          expires: getNumericDate(600) * 1000,
          refresh_token: request.body[OAuthParam.RefreshToken],
        });
    }
    throw new HttpError(HttpStatus.InternalServerError);
  } catch (error) {
    return next(error);
  }
}

export function restrict(...scopes: string[]) {
  return function handleRestriction(request: Request, _: Response, next: NextFunction) {
    try {
      const authRequest = request as AuthRequest;
      if (!authRequest.token) throw new HttpError(HttpStatus.Unauthorized);
      for (const scope of authRequest.token.scopes) {
        if (scope === ADMIN_SCOPE) next();
        for (const sc of scopes) {
          if (scope === sc) next();
        }
      }
      throw new HttpError(HttpStatus.Forbidden);
    } catch (error) {
      return next(error);
    }
  };
}
