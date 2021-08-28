import { Repository } from 'typeorm';
import { User } from '@app/entity/user/User.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '@app/entity/user/UserModule';
import { getTestTypeOrmModule } from '../../../../../libs/entity/test/integration/getTestTypeOrmModule';
import { UserApiService } from '../../../src/user/UserApiService';

describe('UserApiService', () => {
  let userRepository: Repository<User>;
  let userApiService: UserApiService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, getTestTypeOrmModule()],
      providers: [UserApiService],
    }).compile();

    userRepository = module.get('UserRepository');
    userApiService = module.get<UserApiService>(UserApiService);
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  it('findAll', async () => {
    //given
    const firstName = 'Lee';
    const lastName = 'Donguk';
    await userRepository.save(User.byName(firstName, lastName));

    const users = await userApiService.findAll();
    expect(users).toHaveLength(1);
    expect(users[0].firstName).toBe(firstName);
    expect(users[0].lastName).toBe(lastName);
  });
});