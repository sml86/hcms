import { NextFunction, Request, Response } from 'express';
import { HttpError, HttpHeader, HttpStatus } from 'httpepper';
import { RefreshTokenFormatError, RefreshTokenInvalidError } from '../utils/oauth';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

export function handleError(error: Error, request: Request, response: Response, next: NextFunction) {
  if (error instanceof HttpError) {
    console.error(error.message);
    if (error.status === HttpStatus.Unauthorized) response.header(HttpHeader.LOCATION, '/login');
    return response.status(error.status).send(error.statusText);
  }
  if (error instanceof RefreshTokenFormatError || error instanceof RefreshTokenInvalidError) return response.status(HttpStatus.Unauthorized).end();
  if (error instanceof TokenExpiredError) return response.status(HttpStatus.Unauthorized).end();
  if (error instanceof JsonWebTokenError) return response.status(HttpStatus.Forbidden).end();
  console.error(error);
  return response.status(HttpStatus.InternalServerError).end();
}
