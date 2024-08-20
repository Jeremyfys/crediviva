import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ItemDocument = CartItem & Document;

@Schema()
export class CartItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
  productId: string;

  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Number })
  price: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
