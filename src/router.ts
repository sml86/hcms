import { Router, Request, Response, NextFunction } from 'express';
import { json as parseJson, urlencoded as parseUrlencoded } from 'body-parser';
import { HttpStatus } from 'httpepper';
import { handleLogin, handleOAuth, restrict } from './handler/authentication';

export const router = Router();

router.post('/login', handleLogin);
router.post('/oauth/token', parseUrlencoded(), handleOAuth);

router.get('/test', restrict('entity.all'), (_: Request, response: Response) => {
  response.status(HttpStatus.Accepted).end();
});

router.use((_: Request, response: Response) => {
  return response.status(HttpStatus.MethodNotAllowed).end();
});
