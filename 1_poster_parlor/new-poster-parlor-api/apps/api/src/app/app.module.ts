import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@new-poster-parlor-api/logger';
import { AppConfigModule } from '@new-poster-parlor-api/config';
import { DatabaseModule } from '@new-poster-parlor-api/database';
import { AuthModule } from '@new-poster-parlor-api/auth';

@Module({
  imports: [LoggerModule, AppConfigModule, DatabaseModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
