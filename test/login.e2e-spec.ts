import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthDto } from 'src/auth/dto/auth.dto';
import * as request from 'supertest';
import {
	USER_NOT_FOUND_ERROR,
	WRONG_PASSWORD_ERROR,
} from '../src/auth/auth.constants';

const loginDto: AuthDto = {
	login: 'a@a.ru',
	password: '1',
};

describe('AuthCntroller (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - success', async (done) => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send(loginDto)
			.expect(200)
			.then(({ body }: request.Response) => {
				expect(body).toHaveProperty('access_token');
				done();
			});
	});

	it('/auth/login (POST) - fail login', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, login: '123@123.ru' })
			.expect(401, {
				statusCode: 401,
				message: USER_NOT_FOUND_ERROR,
				error: 'Unauthorized',
			});
	});

	it('/auth/login (POST) - fail password', () => {
		return request(app.getHttpServer())
			.post('/auth/login')
			.send({ ...loginDto, password: '123' })
			.expect(401, {
				statusCode: 401,
				message: WRONG_PASSWORD_ERROR,
				error: 'Unauthorized',
			});
	});
});
