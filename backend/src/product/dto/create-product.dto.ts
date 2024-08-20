import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Iphone 13',
  })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descripcion del producto',
    example: 'Es un telefono',
  })
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Url de la imagen',
    example: 'https://picsum.photos/200/300',
  })
  readonly image: string;

  @IsInt()
  @Min(0)
  @ApiProperty({
    description: 'Cantidad del producto',
    example: 'Minimo 0 | Maximo 999',
  })
  readonly quantity: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Precio del producto',
    example: 22.24,
  })
  readonly price: number;
}
