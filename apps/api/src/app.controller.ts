import { Controller, Get } from '@nestjs/common';
import type { ApiResponse } from '@repo/shared-types';
import { createSuccessResponse } from './core/http/api-response.util';
import { AppService } from './app.service';
import type { HelloResponseData } from './app.service';
import { Public } from './core/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): ApiResponse<HelloResponseData> {
    const data = this.appService.getHello();

    return createSuccessResponse(data);
  }
}
