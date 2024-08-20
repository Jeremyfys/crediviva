import {
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
  IsMongoId,
  IsNumber,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from '../entities/cart-item.entity';
import { CheckProduct } from '../../product/utils/validators';

class CartItemDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id del producto',
  })
  readonly productId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nombre del producto',
  })
  readonly name: string;

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Url del producto',
  })
  readonly image: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Cantidad del producto',
  })
  readonly quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Precio del producto',
  })
  readonly price: number;
}

export class AddItemCartDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id del carrito asociado a la sesion del usuario',
  })
  readonly userId: string;

  @Type(() => CartItemDto)
  @CheckProduct()
  @ValidateNested({ each: true })
  @ApiProperty({
    description: 'Producto a agregar al carrito',
    type: () => CartItem,
  })
  readonly item: CartItem;
}
