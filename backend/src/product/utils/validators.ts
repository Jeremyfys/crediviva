import { Injectable } from '@nestjs/common';
import { CartItem } from '@root/cart/entities/cart-item.entity';
import { ProductService } from '@root/product/product.service';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'CheckProductConstraint', async: true })
@Injectable()
export class CheckProductConstraint implements ValidatorConstraintInterface {
  private currentError = '';
  constructor(private readonly productService: ProductService) {}
  async validate(
    value: CartItem,
    args?: ValidationArguments,
  ): Promise<boolean> {
    const product = await this.productService.getProductById(value.productId);
    return !!product;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'El producto no existe';
  }
}

// decorator function
export function CheckProduct(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'CheckProduct',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: CheckProductConstraint,
    });
  };
}
