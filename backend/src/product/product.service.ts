import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateProductDto } from './dto/create-product.dto';
import { Product, ProductDocument } from './entities/product.entity';
import { PaginateProductDto } from './dto/paginate-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const newModel = new this.productModel(createProductDto);
    return newModel.save();
  }

  updateProduct(productId: string, data: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(productId, data).exec();
  }

  getProductById(id: string): Promise<ProductDocument> {
    return this.productModel.findById(id).exec();
  }

  async paginate(params?: PaginateProductDto) {
    const limit = params.limit || 20;
    const currentPage = params.page || 1;
    const skip = limit * (currentPage - 1);
    const total = await this.productModel.countDocuments({});
    const data = await this.productModel.find().limit(limit).skip(skip).exec();

    return {
      data,
      limit,
      total,
      page: currentPage,
    };
  }
}
