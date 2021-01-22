import {Module} from '@nestjs/common';
import {BullModule} from '@nestjs/bull';
import {DownloadsModule} from './downloads/downloads.module';
import {PrismaModule} from './prisma/prisma.module';
import {SentencesModule} from './sentences/sentences.module';
import {KeysModule} from './keys/keys.module';
import {UserDetailsModule} from './user-details/user-details.module';

@Module({
	imports: [
		BullModule.forRoot({
			redis: process.env.REDIS_URL!
		}),
		PrismaModule,
		SentencesModule,
		DownloadsModule,
		KeysModule,
		UserDetailsModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
