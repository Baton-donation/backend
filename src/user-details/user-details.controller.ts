import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {Prisma} from '@prisma/client';
import {DeleteParameters, UserDetailsDto} from './types';
import {UserDetailsService} from './user-details.service';

@Controller('user-details')
export class UserDetailsController {
	constructor(private readonly userDetailsService: UserDetailsService) {}

	@Post()
	async createUserDetails(@Body() body: UserDetailsDto) {
		try {
			const s = await this.userDetailsService.create(body);
			return s;
		} catch (error: unknown) {
			if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2002') {
				throw new HttpException('UUID already exists', HttpStatus.BAD_REQUEST);
			}

			throw error;
		}
	}

	@Get()
	async getUserDetails() {
		return this.userDetailsService.get();
	}

	@Delete(':uuid')
	async deleteSentence(@Param() parameters: DeleteParameters) {
		try {
			await this.userDetailsService.delete(parameters.uuid);

			return {};
		} catch (error: unknown) {
			if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2016') {
				throw new HttpException('UUID does not exist', HttpStatus.NOT_FOUND);
			}

			throw error;
		}
	}
}
