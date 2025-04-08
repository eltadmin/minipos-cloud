import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class CashRegisterAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = this.configService.get<string>('CASH_REGISTER_API_KEY');

    // Check API key
    const providedKey = request.headers['x-api-key'];
    if (!providedKey || providedKey !== apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }

    // Validate device type
    const deviceType = request.headers['devtype'];
    if (!deviceType || deviceType !== 'GPRS') {
      throw new UnauthorizedException('Invalid device type');
    }

    // Validate device serial number
    const deviceSerial = request.headers['devser'];
    if (!deviceSerial || !/^\d{10}$/.test(deviceSerial.toString())) {
      throw new UnauthorizedException('Invalid device serial number');
    }

    return true;
  }
} 