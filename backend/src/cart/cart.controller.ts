import {
  Controller,
  Post,
  Body,
  Delete,
  NotFoundException,
  Query,
  Get,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiTags } from '@nestjs/swagger';
import { AddItemCartDto } from './dto/add-item-cart.dto';
import { RemoveItemCartDto } from './dto/remove-item-cart.dto';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('')
  getCartAndCreate(@Body() { userId }: { userId: string }) {
    return this.cartService.create(userId);
  }

  @Post('add')
  addItemToCart(@Body() { item, userId }: AddItemCartDto) {
    return this.cartService.addItemToCart(userId, item);
  }

  @Delete('remove')
  removeItemFromCart(@Query() { userId, productId }: RemoveItemCartDto) {
    return this.cartService.removeItemFromCart(userId, productId);
  }
}
