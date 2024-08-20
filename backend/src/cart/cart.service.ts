import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Cart, CartDocument } from './entities/cart.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CartGateway } from './cart.gateway';
import { CartItem } from './entities/cart-item.entity';
import { ProductService } from '@root/product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    private productService: ProductService,
    private cartGateway: CartGateway,
  ) {}

  async create(userId: string) {
    const cart = await this.cartModel.findOne<CartDocument>({ userId }).exec();
    if (cart) {
      return cart;
    }

    const newCart = new this.cartModel({
      userId: userId,
      items: [],
    });

    return newCart.save();
  }

  async resetCart(id: string, data: Partial<Cart>): Promise<CartDocument> {
    const update = await this.cartModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
    this.cartGateway.notify(`cart-reset-${update.userId}`, update);
    return update;
  }

  async addItemToCart(userId: string, cartItem: CartItem): Promise<Cart> {
    const { productId, quantity } = cartItem;

    const product = await this.productService.getProductById(productId);
    const cart = await this.getCart(userId);

    if (!cart) {
      throw new InternalServerErrorException(
        `No se logro encontrar el carrito`,
      );
    }

    const index = cart.items.findIndex((item) => item.productId == productId);
    const item = index > -1 ? cart.items[index] : cartItem;
    if (product.quantity < quantity) {
      throw new ConflictException(
        `El producto solo tiene ${product.quantity} unidades disponibles`,
      );
    }

    if (index > -1) {
      item.quantity = Number(quantity);
      cart.items[index] = item;
      this.cartGateway.notify(`cart-update-${userId}`, item);
    } else {
      cart.items.push(item);
      this.cartGateway.notify(`cart-add-${userId}`, cartItem);
    }

    return cart.save();
  }

  async removeItemFromCart(
    userId: string,
    productId: string,
  ): Promise<{ message: string; cart: CartDocument }> {
    const cart = await this.getCart(userId);

    const itemIndex = cart.items.findIndex(
      (item) => item.productId == productId,
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      const doc = await cart.save();
      this.cartGateway.notify(`cart-remove-${userId}`, productId);
      return {
        message: 'Producto eliminado',
        cart: doc,
      };
    }
    throw new NotFoundException('El producto no existe en el carrito');
  }

  async getCart(userId: string): Promise<CartDocument> {
    const cart = await this.cartModel.findOne({ userId }).exec();
    return cart;
  }
}
