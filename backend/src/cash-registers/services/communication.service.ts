import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as xml2js from 'xml2js';
import { CashRegister, CashRegisterStatus } from '../entities/cash-register.entity';

interface CashRegisterHeader {
  ssn: string;          // Serial number
  mod: string;          // Model
  imsi: string;         // SIM card ID
  FDIN: string;         // Fiscal memory number
  FMIN: string;         // Registration number
  SV: string;          // Software version
  upd: string;         // Update flag
  RType: string;       // Request type
  FDRID: string;       // Document ID
  zsent: string;       // Z-reports sent
  zsaved: string;      // Z-reports saved
  dbv: string;         // Database versions
  rcnt: string;        // Record count
  bat: string;         // Battery status
}

@Injectable()
export class CashRegisterCommunicationService {
  private readonly logger = new Logger(CashRegisterCommunicationService.name);
  private readonly parser = new xml2js.Parser();
  private readonly builder = new xml2js.Builder();

  constructor(
    @InjectRepository(CashRegister)
    private readonly cashRegisterRepository: Repository<CashRegister>,
    private readonly configService: ConfigService,
  ) {}

  async handleIncomingRequest(xmlData: string, headers: Record<string, string>): Promise<string> {
    try {
      // Parse XML request
      const request = await this.parser.parseStringPromise(xmlData);
      const header = this.extractHeader(request.SRES);

      // Find or create cash register
      let cashRegister = await this.findCashRegister(header);
      if (!cashRegister) {
        this.logger.warn(`Unregistered cash register: ${header.ssn}`);
        return this.buildErrorResponse('Cash register not registered');
      }

      // Update cash register status
      await this.updateCashRegisterStatus(cashRegister, header);

      // Process request based on type
      const response = await this.processRequest(cashRegister, request.SRES);

      // Log communication
      await this.logCommunication(cashRegister.id, 'connect', 'Request processed successfully', {
        requestType: header.RType,
        headers,
      });

      return this.builder.buildObject(response);
    } catch (error) {
      this.logger.error('Error processing request', error);
      return this.buildErrorResponse('Internal server error');
    }
  }

  private extractHeader(data: any): CashRegisterHeader {
    return {
      ssn: data.ssn[0],
      mod: data.mod[0],
      imsi: data.imsi[0],
      FDIN: data.FDIN[0],
      FMIN: data.FMIN[0],
      SV: data.SV[0],
      upd: data.upd[0],
      RType: data.RType[0],
      FDRID: data.FDRID[0],
      zsent: data.zsent[0],
      zsaved: data.zsaved[0],
      dbv: data.dbv[0],
      rcnt: data.rcnt[0],
      bat: data.bat[0],
    };
  }

  private async findCashRegister(header: CashRegisterHeader): Promise<CashRegister | null> {
    return this.cashRegisterRepository.findOne({
      where: [
        { serialNumber: header.ssn },
        { fiscalMemoryNumber: header.FDIN },
        { registrationNumber: header.FMIN },
      ],
      relations: ['account'],
    });
  }

  private async updateCashRegisterStatus(cashRegister: CashRegister, header: CashRegisterHeader): Promise<void> {
    // Parse database versions
    const dbVersions = header.dbv.split(',').reduce((acc, curr) => {
      const [key, value] = curr.split(/(\d+)/);
      acc[key] = parseInt(value, 10);
      return acc;
    }, {} as Record<string, number>);

    // Update cash register
    cashRegister.lastSyncAt = new Date();
    cashRegister.firmwareVersion = header.SV;
    cashRegister.dbVersions = dbVersions;
    
    // Update status if subscription is expired
    if (cashRegister.subscriptionExpiresAt && cashRegister.subscriptionExpiresAt < new Date()) {
      cashRegister.status = CashRegisterStatus.SUSPENDED;
    }

    await this.cashRegisterRepository.save(cashRegister);
  }

  private async processRequest(cashRegister: CashRegister, data: any): Promise<any> {
    // Base response structure
    const response = {
      SRES: {
        status: '0',
        message: 'OK',
        lastDocument: data.FDRID[0],
        tasks: [],
      },
    };

    // Process fiscal reports if present
    if (data.data && data.data[0] && data.data[0].Z) {
      await this.processFiscalReports(cashRegister, data.data[0].Z);
    }

    // Process sales documents if present
    if (data.data && data.data[0] && data.data[0].S) {
      await this.processSaleDocuments(cashRegister, data.data[0].S);
    }

    // Add tasks based on status and settings
    if (cashRegister.status === CashRegisterStatus.ACTIVE || cashRegister.status === CashRegisterStatus.DEMO) {
      // Check if we need to sync products
      const syncTasks = await this.generateSyncTasks(cashRegister);
      if (syncTasks.length > 0) {
        response.SRES.tasks.push(...syncTasks);
      }
    }

    return response;
  }

  private async processFiscalReports(cashRegister: CashRegister, reports: any[]): Promise<void> {
    // TODO: Implement fiscal report processing
    this.logger.log(`Processing ${reports.length} fiscal reports for ${cashRegister.serialNumber}`);
  }

  private async processSaleDocuments(cashRegister: CashRegister, sales: any[]): Promise<void> {
    // TODO: Implement sales document processing
    this.logger.log(`Processing ${sales.length} sales documents for ${cashRegister.serialNumber}`);
  }

  private async generateSyncTasks(cashRegister: CashRegister): Promise<any[]> {
    const tasks = [];

    // TODO: Generate tasks for syncing products, departments, operators, etc.
    // This requires querying the database for entities with version numbers higher than
    // what's reported by the cash register

    return tasks;
  }

  private buildErrorResponse(message: string): string {
    const response = {
      SRES: {
        status: '1',
        message,
      },
    };
    return this.builder.buildObject(response);
  }

  private async logCommunication(
    cashRegisterId: string,
    type: 'connect' | 'disconnect' | 'error' | 'sync',
    message: string,
    details?: Record<string, any>,
  ): Promise<void> {
    await this.cashRegisterRepository
      .createQueryBuilder()
      .update(CashRegister)
      .where('id = :id', { id: cashRegisterId })
      .set({
        communicationLog: () =>
          `communicationLog || ${JSON.stringify([
            {
              timestamp: new Date(),
              type,
              message,
              details,
            },
          ])}::jsonb`,
      })
      .execute();
  }
} 