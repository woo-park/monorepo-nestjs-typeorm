import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ApiAppModule } from '../../src/ApiAppModule';
import { getConnection, Repository } from 'typeorm';
import { setNestApp } from '@app/common-config/setNextWebApp';
import { User } from '@app/entity/domain/user/User.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ResponseEntity } from '@app/common-config/res/ResponseEntity';
import { ResponseStatus } from '@app/common-config/res/ResponseStatus';
import { UserSignupReq } from '../../src/user/dto/UserSignupReq';
import { LocalDateTime } from 'js-joda';
import { DateTimeUtil } from '@app/entity/util/DateTimeUtil';

describe('UserApiController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ApiAppModule],
    }).compile();

    app = module.createNestApplication();
    userRepository = module.get(getRepositoryToken(User));

    setNestApp(app); // ClassSerializerInterceptor 적용
    await app.init();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  afterEach(async () => {
    await userRepository.clear();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/show (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/user/show');

    expect(res.status).toBe(200);
    const data = res.body.data;
    console.log(`>>>>>>>>>>>>>> response body = ${JSON.stringify(data)}`);
    expect(data.firstName).toBe('KilDong');
    expect(data.lastName).toBe('Hong');
    expect(data.orderDateTime).toBe('2021-10-17 00:00:00');
  });

  it('/signup (POST)', async () => {
    const firstName = 'KilDong';
    const lastName = 'Hong';
    const dateTime = LocalDateTime.of(2021, 10, 17, 0, 0, 0);

    const req = UserSignupReq.of(firstName, lastName, dateTime);
    const res = await request(app.getHttpServer())
      .post('/user/signup')
      .send({
        firstName: firstName,
        lastName: lastName,
        orderDateTime: DateTimeUtil.toString(dateTime),
      });

    expect(res.status).toBe(HttpStatus.CREATED);
    const body: ResponseEntity<string> = res.body;
    expect(body.statusCode).toBe(ResponseStatus.OK);

    const user = await userRepository.findOne();
    expect(user.firstName).toBe(firstName);
    expect(user.lastName).toBe(lastName);
  });
});