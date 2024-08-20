import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() { userId }: CreateOrderDto) {
    return this.orderService.createOrder(userId);
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Get('list/:id')
  getOrders(@Param('id') id: string) {
    return this.orderService.getOrdersByUserId(id);
  }
}
