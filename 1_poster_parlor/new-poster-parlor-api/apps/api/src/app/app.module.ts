import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@new-poster-parlor-api/logger';
import { AppConfigModule } from '@new-poster-parlor-api/config';
import { DatabaseModule } from '@new-poster-parlor-api/database';

@Module({
  imports: [LoggerModule, AppConfigModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
