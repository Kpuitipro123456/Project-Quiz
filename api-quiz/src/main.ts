import * as config from 'config';
import {NestFactory} from '@nestjs/core';
import {ApplicationModule} from './modules/app.module';
import {getHost, readConfig} from './modules/common/config.provider';
import {initSwagger} from './lib/swagger-init';
import {CORS_EXPOSED_HEADERS} from './shared/constants';
import * as httpContext from 'express-http-context';
import * as responseTime from 'response-time';
import {ValidationPipe} from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, {
    bodyParser: true,
    cors: true,
  });

  app.enableCors({
    exposedHeaders: CORS_EXPOSED_HEADERS,
  });
  app.use(httpContext.middleware);
  app.use(responseTime({header: 'x-response-time'}));
  app.setGlobalPrefix('/api/quiz');
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());

  await initSwagger(app);
  try {
    return app.listen(readConfig('server.port'));
  } catch (error) {
    /* tslint:disable */
    console.log('Bootstrap error: ', error);
    return Promise.reject(error);
  }
}

bootstrap()
  .then(() => {
    const hostname = getHost();
    /* tslint:disable */
    console.log(`Started on http(s)://${getHost()}/api/quiz`);
    /* tslint:disable */
    console.log(`Docs available on http(s)://${hostname}${config.get('service.docsBaseUrl')}`);
  })
  .catch((error) => {
    console.log('Bootstrap application failed', error);
  });
