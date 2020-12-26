import {BullModule} from '@nestjs/bull';
import {Module} from '@nestjs/common';
import {PrismaModule} from 'src/prisma/prisma.module';
import {DownloadsController} from './downloads.controller';
import {DownloadsProcessor} from './downloads.processor';
import {DownloadsService} from './downloads.service';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'downloads'
		}),
		PrismaModule
	],
	controllers: [DownloadsController],
	providers: [DownloadsProcessor, DownloadsService]
})
export class DownloadsModule {}
