import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@app/entity/user/User.entity';
import { Repository } from 'typeorm';
import { UserModule } from '@app/entity/user/UserModule';
import { getPgTestTypeOrmModule } from '../../../getPgTestTypeOrmModule';
import { UserQueryRepository } from '@app/entity/user/UserQueryRepository';

describe('UserQueryRepository', () => {
  let userRepository: Repository<User>;
  let userQueryRepository: UserQueryRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, getPgTestTypeOrmModule()],
    }).compile();

    userQueryRepository = module.get<UserQueryRepository>(UserQueryRepository);
    userRepository = module.get('UserRepository');
  });

  afterEach(async () => {
    await userRepository.clear();
  });

  it('save', async () => {
    // given
    const firstName = 'Lee';
    const lastName = 'Donguk';
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;

    // when
    const savedUser = await userRepository.save(user);

    // then
    expect(savedUser.id).toBeGreaterThanOrEqual(1);
  });

  it('findUserName', async () => {
    // given
    const firstName = 'Lee';
    const lastName = 'Donguk';
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    const savedUser = await userRepository.save(user);

    // when
    const result = await userQueryRepository.findUserName(savedUser.id);

    // then
    expect(result.getFullName()).toBe(`${firstName} ${lastName}`);
  });
});