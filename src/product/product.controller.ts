import {
	Controller,
	Post,
	Body,
	Get,
	Param,
	Delete,
	Patch,
	HttpCode,
	HttpException,
	HttpStatus,
	UsePipes,
	ValidationPipe,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productSerive: ProductService) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return this.productSerive.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const product = await this.productSerive.findById(id);
		if (!product) {
			throw new HttpException(
				PRODUCT_NOT_FOUND_ERROR,
				HttpStatus.NOT_FOUND,
			);
		}
		return product;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedProduct = await this.productSerive.deleteById(id);
		if (!deletedProduct) {
			throw new HttpException(
				PRODUCT_NOT_FOUND_ERROR,
				HttpStatus.NOT_FOUND,
			);
		}
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: ProductModel,
	) {
		const updatedProduct = await this.productSerive.updateById(id, dto);
		if (!updatedProduct) {
			throw new HttpException(
				PRODUCT_NOT_FOUND_ERROR,
				HttpStatus.NOT_FOUND,
			);
		}
		return updatedProduct;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto) {
		return this.productSerive.findWithReviews(dto);
	}
}
