import { Controller, Post, Body, Headers, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CashRegisterCommunicationService } from '../services/communication.service';
import { CashRegisterAuthGuard } from '../guards/cash-register-auth.guard';

@ApiTags('Cash Register Communication')
@Controller('cash-registers/communication')
export class CashRegisterCommunicationController {
  constructor(
    private readonly communicationService: CashRegisterCommunicationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(CashRegisterAuthGuard)
  @ApiOperation({ summary: 'Handle incoming cash register request' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request processed successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid cash register credentials',
  })
  async handleRequest(
    @Body() xmlData: string,
    @Headers() headers: Record<string, string>,
  ): Promise<string> {
    return this.communicationService.handleIncomingRequest(xmlData, headers);
  }
} 