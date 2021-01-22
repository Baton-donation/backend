import {Injectable} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {UserDetailsDto} from './types';

@Injectable()
export class UserDetailsService {
	constructor(private readonly prisma: PrismaService) {}

	async create(details: UserDetailsDto): Promise<UserDetailsDto> {
		return this.prisma.userDetails.create({data: details});
	}

	async get(): Promise<UserDetailsDto[]> {
		return this.prisma.userDetails.findMany();
	}

	async delete(uuid: string) {
		await this.prisma.userDetails.delete({where: {uuid}});
	}
}
