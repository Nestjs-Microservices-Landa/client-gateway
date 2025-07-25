import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { ORDERS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(ORDERS_SERVICE) private readonly orders: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    console.log('Gateway: /orders POST recibido', createOrderDto);
    return this.orders.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() orderPAginationDto: OrderPaginationDto) {
   return this.orders.send('findAllOrders', orderPAginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(
        this.orders.send('findOneOrder', { id }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(@Param() statusDto: StatusDto, @Query() paginationDto: PaginationDto) {
    try {
      return this.orders.send('findAllByStatus', {
        ...paginationDto,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.orders.send('changeStatus', { id, status: statusDto.status });
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
