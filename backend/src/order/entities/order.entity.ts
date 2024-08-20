import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  cartId: string;

  @Prop({ required: true })
  items: OrderItem[];

  @Prop({ required: true, type: Number })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderItemDocument = OrderItem & Document;

@Schema()
export class OrderItem {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
  productId: string;

  @Prop()
  name: string;

  @Prop({ type: Number })
  quantity: number;

  @Prop({ type: Number })
  price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
