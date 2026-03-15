import { Test, TestingModule } from '@nestjs/testing';
import { ClienteProxyRmqService } from './cliente-proxy-rmq.service';

describe('ClienteProxyRmqService', () => {
  let service: ClienteProxyRmqService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClienteProxyRmqService],
    }).compile();

    service = module.get<ClienteProxyRmqService>(ClienteProxyRmqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
