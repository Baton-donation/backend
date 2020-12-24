import { Controller, Get } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';

@Controller('keys')
export class KeysController {
  constructor(private config: ConfigService) {}

  @Get('public')
  getPublicKey() {
    return this.config.env.PUBLIC_KEY;
  }
}
