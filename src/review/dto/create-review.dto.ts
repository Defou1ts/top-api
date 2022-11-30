import { IsString, IsNumber, Max, Min } from 'class-validator';

export class CreateReviewDto {
	@IsString({ message: 'name должно быть строкой' })
	name: string;

	@IsString({ message: 'title должно быть строкой' })
	title: string;

	@IsString({ message: 'description должно быть строкой' })
	description: string;

	@Max(5, { message: 'Рейтинг не может быть более 5' })
	@Min(1, { message: 'Рейтинг не может быть менее 1' })
	@IsNumber()
	rating: number;

	@IsString({ message: 'productId должно быть строкой' })
	productId: string;
}
