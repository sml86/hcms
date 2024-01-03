import express, { Application } from 'express';
import helmet from 'helmet';
import { Server } from 'http';
import { handleError } from './handler/error';
import { router } from './router';
import { handleAuthentication } from './handler/authentication';
import { Pool } from 'pg';

/**
 * exporting for better testability
 */
export let server: Server;
export let app: Application | null = null;

try {
  const port = parseInt(process.env.PORT || '8088');
  app = express();
  app.locals.pool = new Pool();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(handleAuthentication);
  app.use(router);
  app.use(handleError);
  server = app.listen(port, () => {
    console.info(`Http server listening on localhost::${port}`);
  });
} catch (error) {
  console.error(error);
  process.exit(-1);
}
