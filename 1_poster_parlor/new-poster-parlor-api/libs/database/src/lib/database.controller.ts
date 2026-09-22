import { Controller, Get } from '@nestjs/common';
import { DatabaseHealthService } from './database.service';
@Controller('db-health')
export class DatabaseController {
    constructor(private readonly databaseHealthService: DatabaseHealthService) { }

    @Get()
    async healthCheck() {
        const res = await this.databaseHealthService.checkHealth();
        return res;
    }
}
