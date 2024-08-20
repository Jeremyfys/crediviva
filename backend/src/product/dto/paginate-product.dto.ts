import { IsPositive, IsOptional, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderType {
  asc = 'asc',
  desc = 'desc',
}

export class PaginateProductDto {
  /**
   * Limite de registros por consulta
   */
  @IsOptional()
  @IsPositive()
  @ApiProperty({ type: Number, required: false })
  limit: number;

  /**
   * Pagina actual
   */
  @IsOptional()
  @Min(1)
  @ApiProperty({ type: Number, required: false })
  page: number;

  /**
   * Propiedad por donde se ordenara la consulta
   */
  @IsOptional()
  @ApiProperty({ type: String, required: false })
  orderBy: string;

  /**
   * Orden ascendente y descendente
   */
  @IsOptional()
  @IsEnum(OrderType)
  @ApiProperty({ enum: OrderType, required: false })
  orderType: OrderType;
}
