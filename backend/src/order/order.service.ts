import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order, OrderItem } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartService } from '@root/cart/cart.service';
import { ProductService } from '@root/product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async createOrder(userId: string) {
    const cart = await this.cartService.getCart(userId);

    if (!cart) {
      throw new NotFoundException('No existe el carrito');
    }

    if (cart.items.length === 0) {
      throw new NotFoundException('El carrito no tiene productos');
    }

    const updatePromises: Promise<any>[] = [];
    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of cart.items) {
      const { name, price, quantity, productId } = item;
      const product = await this.productService.getProductById(item.productId);

      if (!product) {
        throw new NotFoundException(
          `El producto con el ID ${product._id} no existe en el sistema`,
        );
      }

      // No hay suficientes unidades
      if (product.quantity < quantity) {
        throw new ConflictException(
          `El producto ${product.name} solo tiene ${product.quantity} unidades disponibles`,
        );
      }

      // Update Product Qty
      updatePromises.push(
        this.productService.updateProduct(item.productId, {
          quantity: product.quantity - quantity,
        }),
      );
      orderItems.push({ name, price, quantity, productId });
      total += price * quantity;
    }

    const order = new this.orderModel({
      cartId: userId,
      items: orderItems,
      total,
    });

    // Reset cart
    updatePromises.push(this.cartService.resetCart(cart.id, { items: [] }));

    // Save Order
    updatePromises.push(order.save());

    return Promise.allSettled(updatePromises);
  }

  getOrdersByUserId(userId: string) {
    return this.orderModel.find({ cartId: userId }).exec();
  }

  getOrderById(id: string) {
    return this.orderModel.findById(id).exec();
  }
}
