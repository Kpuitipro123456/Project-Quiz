import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import * as fs from 'fs';
import * as swaggerUI from 'swagger-ui-express';
import {API_VERSION, ACCESS_TOKEN_HEADER_NAME} from '../shared/constants';
// import { injectEndpointPolicyToSwaggerMetadata } from '../shared/swagger.helper';

const writeSwaggerJson = (path: string, document) => {
  fs.writeFileSync(`${path}/swagger.json`, JSON.stringify(document, null, 2), {encoding: 'utf8'});
};

export const initSwagger = async (app) => {
  // await injectEndpointPolicyToSwaggerMetadata(app);
  const options = new DocumentBuilder()
    .setTitle('Quiz API')
    .setDescription('Swagger specification for api-quiz | [swagger.json](swagger.json)')
    .setVersion(API_VERSION)
    .addBearerAuth(
      {type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header'},
      ACCESS_TOKEN_HEADER_NAME,
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  writeSwaggerJson(`${process.cwd()}`, document);
  app.use('/docs/quiz/swagger.json', (_, res) => {
    // swagger json
    res.json(document);
  });
  app.use(
    '/docs/quiz',
    swaggerUI.serve,
    swaggerUI.setup(document, {
      swaggerOptions: {
        displayOperationId: true,
      },
      customSiteTitle: 'Quiz API',
    }),
  ); // swagger ui
};
