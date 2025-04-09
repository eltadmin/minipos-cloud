import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { InventoryService } from '../services/inventory.service';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stock-levels')
  @ApiOperation({ summary: 'Get stock levels for the current account' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getStockLevels(@Request() req, @Query() query: any) {
    return this.inventoryService.getStockLevels(req.user.accountId, query);
  }

  @Get('stock-movements')
  @ApiOperation({ summary: 'Get stock movements for the current account' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getStockMovements(@Request() req, @Query() query: any) {
    return this.inventoryService.getStockMovements(req.user.accountId, query);
  }

  @Get('locations')
  @ApiOperation({ summary: 'Get locations for the current account' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getLocations(@Request() req) {
    return this.inventoryService.getLocations(req.user.accountId);
  }

  @Post('locations')
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  async createLocation(@Request() req, @Body() locationData: any) {
    return this.inventoryService.createLocation(req.user.accountId, locationData);
  }

  @Get('documents')
  @ApiOperation({ summary: 'Get inventory documents for the current account' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getDocuments(@Request() req, @Query() query: any) {
    return this.inventoryService.getDocuments(req.user.accountId, query);
  }

  @Post('documents')
  @ApiOperation({ summary: 'Create a new inventory document' })
  @ApiResponse({ status: 201, description: 'Document created successfully' })
  async createDocument(@Request() req, @Body() documentData: any) {
    return this.inventoryService.createDocument(req.user.accountId, documentData);
  }

  @Get('documents/:id')
  @ApiOperation({ summary: 'Get a specific inventory document' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocument(@Request() req, @Param('id') id: string) {
    return this.inventoryService.getDocument(req.user.accountId, id);
  }

  @Put('documents/:id/confirm')
  @ApiOperation({ summary: 'Confirm an inventory document' })
  @ApiResponse({ status: 200, description: 'Document confirmed successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async confirmDocument(@Request() req, @Param('id') id: string) {
    return this.inventoryService.confirmDocument(req.user.accountId, id);
  }

  @Put('documents/:id/cancel')
  @ApiOperation({ summary: 'Cancel an inventory document' })
  @ApiResponse({ status: 200, description: 'Document canceled successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async cancelDocument(@Request() req, @Param('id') id: string) {
    return this.inventoryService.cancelDocument(req.user.accountId, id);
  }
} 