import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsModule } from './ingredients/ingredients.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      // username: null,
      // password: null,
      database: process.env.DATABASE_NAME,
      // ssl: true,
      autoLoadEntities: true,
      // Only enable this option if your application is in development,
      // otherwise use TypeORM migrations to sync entity schemas:
      // https://typeorm.io/#/migrations
      // synchronize: true,
    }),
    IngredientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
