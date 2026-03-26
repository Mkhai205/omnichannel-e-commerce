import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return ApiResponse envelope', () => {
      expect(appController.getHello()).toEqual({
        success: true,
        statusCode: 200,
        message: 'Successfully!',
        data: {
          greeting: 'Hello World!',
        },
      });
    });
  });
});
