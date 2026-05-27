import { INestApplication, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "common/filters/http-exception.filter";
import { ResponseInterceptor } from "common/interceptors/response.interceptor";
import cookieParser from 'cookie-parser';


export const globalConfig = (app: INestApplication) => {
    app.use(cookieParser());
    app.enableCors({
        origin: "http://localhost:5173",
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new ResponseInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());


}
