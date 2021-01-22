import {Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {UserDetailsDto} from './types';

@Injectable()
export class UserDetailsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(details: UserDetailsDto): Promise<UserDetailsDto> {
		const instance = await this.prisma.userDetails.create({data: details});

		return {...instance, data: instance.data! as Record<string, unknown>};
	}

	async delete(uuid: string) {
		await this.prisma.userDetails.delete({where: {uuid}});
	}
}
