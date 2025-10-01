import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Configuração Global: Validação de DTOs e transformação de tipos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão no DTO
      transform: true, // Transforma o payload em instâncias de DTO
      forbidNonWhitelisted: true, // Lanã erro se houver campos extras
    }),
  );

  // 2. Configuração do Swagget/OpenAPI (Documentação automática da API)
  const config = new DocumentBuilder()
    .setTitle('Chimera API')
    .setDescription('Documentação dos endpoints da aplicação')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();

  await app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
    console.log('Documentação Swagger em http://localhost:3000/api/docs');
  });
}

bootstrap();
