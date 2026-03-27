/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailService } from './send-email.service';
import { MailgunService } from '../mailgun/mailgun.service';
import { RpcException } from '@nestjs/microservices';

describe('SendEmailService', () => {
  let sendEmailService: SendEmailService;
  let mailgunService: MailgunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SendEmailService,
        {
          provide: MailgunService,
          useValue: {
            sendSimpleMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    sendEmailService = module.get<SendEmailService>(SendEmailService);
    mailgunService = module.get<MailgunService>(MailgunService);
  });

  it('should be defined', () => {
    expect(sendEmailService).toBeDefined();
  });

  describe('sendMessage', () => {
    it('Should send email successfully', async () => {
      const dto = {
        to: 'test@email.com',
        applicantName: 'Gustavo',
        challengedName: 'Joao',
      };

      jest
        .spyOn(mailgunService, 'sendSimpleMessage')
        .mockResolvedValue({} as any);

      const result = await sendEmailService.sendMessage(dto as any);

      expect(mailgunService.sendSimpleMessage).toHaveBeenCalledTimes(1);

      expect(mailgunService.sendSimpleMessage).toHaveBeenCalledWith(
        dto.to,
        expect.any(String),
        expect.any(String),
        expect.any(String),
        expect.any(String),
      );

      expect(result).toEqual({});
    });

    it('Should return generic error "RpcException"', async () => {
      const dto = {
        to: 'test@email.com',
        applicantName: 'Gustavo',
        challengedName: 'Joao',
      };

      jest
        .spyOn(mailgunService, 'sendSimpleMessage')
        .mockRejectedValue(new Error('fail'));

      await expect(sendEmailService.sendMessage(dto as any)).rejects.toThrow(
        RpcException,
      );
    });
  });
});
