import {Controller, Get, Param, Post, UnauthorizedException, Headers} from '@nestjs/common';
import * as securePin from 'secure-pin';
import checkAuthHeader from 'src/lib/check-auth-header';
import {PrismaService} from 'src/prisma/prisma.service';
import {ValidateCodeParameters} from './types';

const VALID_TIME_MS = 31 * 24 * 60 * 60 * 1000;

@Controller('codes')
export class CodesController {
	constructor(private readonly prisma: PrismaService) {}

	@Post()
	async createCode(@Headers('authorization') authHeader: string) {
		checkAuthHeader(authHeader);

		return new Promise((resolve, reject) => {
			securePin.generatePin(6, async pin => {
				try {
					const createdCode = await this.prisma.unlockCode.create({
						data: {
							code: pin
						}
					});

					resolve(createdCode);
				} catch (error: unknown) {
					reject(error);
				}
			});
		});
	}

	@Get('validate/:code')
	async isCodeValid(@Param() parameters: ValidateCodeParameters) {
		const storedCode = await this.prisma.unlockCode.findFirst({
			where: {
				code: parameters.code
			}
		});

		if (!storedCode) {
			throw new UnauthorizedException();
		}

		const nowMs = Date.now();

		if (nowMs - storedCode.createdAt.getTime() > VALID_TIME_MS) {
			throw new UnauthorizedException();
		}

		return {};
	}
}
