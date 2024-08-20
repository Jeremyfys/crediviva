import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CartItem } from './cart-item.entity';

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
