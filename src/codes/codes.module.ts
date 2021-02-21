import {Module} from '@nestjs/common';
import {PrismaModule} from 'src/prisma/prisma.module';
import {CodesController} from './codes.controller';

@Module({
	imports: [
		PrismaModule
	],
	controllers: [CodesController],
	providers: []
})
export class CodesModule {}
