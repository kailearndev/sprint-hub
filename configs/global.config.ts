import { INestApplication, ValidationPipe } from "@nestjs/common";
import cookieParser from 'cookie-parser';


export const globalConfig = (app: INestApplication) => {
    app.use(cookieParser());
    app.enableCors({
        origin: '*',
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));


}