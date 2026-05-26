import { INestApplication } from "@nestjs/common";


export const globalConfig = (app: INestApplication) => {
    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });

}