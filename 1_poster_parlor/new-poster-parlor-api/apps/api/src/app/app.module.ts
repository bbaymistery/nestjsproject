import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from '@new-poster-parlor-api/logger';
import { AppConfigModule } from '@new-poster-parlor-api/config';
import { DatabaseModule } from '@new-poster-parlor-api/database';
import { AuthModule } from '@new-poster-parlor-api/auth';
import { InventoryModule } from '@new-poster-parlor-api/inventory';
import { ReviewModule } from '@new-poster-parlor-api/review';
@Module({
  imports: [LoggerModule, AppConfigModule, DatabaseModule, AuthModule, InventoryModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
