import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    // You can still use AppService if needed for future logic
    const serviceMessage = this.appService.getHello();
    
    // Return a clean JSON response
    return {
      message: '✅ API is running successfully!',
      serviceMessage,
    };
  }
}
