import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config.schema';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.prod'],
      validationSchema: configValidationSchema,
    }),
    TasksModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProduction = configService.get('STAGE') === 'prod';

        console.log('isProduction', isProduction);

        const HOST = isProduction
          ? configService.get('POSTGRES_HOST_PROD')
          : 'localhost';
        const PSW = isProduction
          ? configService.get('POSTGRES_PASSWORD_PROD')
          : configService.get('POSTGRES_PASSWORD');
        const USERNAME = isProduction
          ? configService.get('POSTGRES_USERNAME_PROD')
          : configService.get('POSTGRES_USERNAME');

        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          host: HOST,
          port: parseInt(configService.get('POSTGRES_PORT')),
          username: USERNAME,
          password: PSW,
          database: configService.get('POSTGRES_DB'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    AuthModule,
  ],
})
export class AppModule {}
