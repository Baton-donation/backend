import {Module} from '@nestjs/common';
import {PrismaModule} from 'src/prisma/prisma.module';
import {UserDetailsController} from './user-details.controller';
import {UserDetailsService} from './user-details.service';

@Module({
	imports: [
		PrismaModule
	],
	controllers: [UserDetailsController],
	providers: [UserDetailsService]
})
export class UserDetailsModule {}
