import {Module} from '@nestjs/common';
import {ConfigModule} from 'src/config/config.module';
import {KeysController} from './keys.controller';

@Module({
	imports: [ConfigModule],
	controllers: [KeysController],
	providers: []
})
export class KeysModule {}
