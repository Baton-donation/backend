import {BullModule} from '@nestjs/bull';
import {Module} from '@nestjs/common';
import {PrismaModule} from 'src/prisma/prisma.module';
import {SentencesController} from './sentences.controller';
import {SentencesService} from './sentences.service';

@Module({
	imports: [
		PrismaModule
	],
	controllers: [SentencesController],
	providers: [SentencesService]
})
export class SentencesModule {}
