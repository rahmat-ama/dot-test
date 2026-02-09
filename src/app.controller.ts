import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Server')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Check whether server running or not' })
  @ApiOkResponse({ description: 'Server is running' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get()
  getHome() {
    return 'Server is running';
  }
}
