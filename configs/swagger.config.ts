import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


export const swaggerConfig = (app: INestApplication) => {

    const config = new DocumentBuilder()
        .setTitle('Sprint Hub API')
        .setDescription('The sprint hub API description')
        .setVersion('1.0')
        .addTag('sprint-hub')
        .addBearerAuth()
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, documentFactory, {
        jsonDocumentUrl: 'api/docs-json',
    });
}