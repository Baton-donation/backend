import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bull';
import {DownloadsModule} from './downloads/downloads.module';
import {PrismaModule} from './prisma/prisma.module';
import {SentencesModule} from './sentences/sentences.module';
import {KeysModule} from './keys/keys.module';

@Module({
	imports: [
		BullModule.forRoot({
			// TODO: use env var
			redis: {
				host: 'localhost',
				port: 6379
			}
		}),
		PrismaModule,
		SentencesModule,
		DownloadsModule,
		KeysModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
