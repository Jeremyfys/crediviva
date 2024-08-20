import { IsNotEmpty, IsString, IsUUID, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveItemCartDto {
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id del carrito asociado a la sesion del usuario',
    example: 'randomId',
  })
  readonly userId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id del producto a eliminar del carrito',
    example: 'Id del producto',
  })
  readonly productId: string;
}
