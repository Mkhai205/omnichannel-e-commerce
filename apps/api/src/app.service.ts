import { Injectable } from '@nestjs/common';

export interface HelloResponseData {
  greeting: string;
}

@Injectable()
export class AppService {
  getHello(): HelloResponseData {
    return {
      greeting: 'Hello World!',
    };
  }
}
