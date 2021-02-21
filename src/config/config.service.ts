import * as dotenv from 'dotenv';
import {Injectable} from '@nestjs/common';

interface IEnv {
	PUBLIC_KEY: string;
	DATA_DIR: string;
	AUTH_TOKEN: string;
}

@Injectable()
export class ConfigService {
	public env: IEnv;

	constructor() {
		dotenv.config();

		this.env = {
			PUBLIC_KEY: process.env.PUBLIC_KEY!,
			DATA_DIR: process.env.DATA_DIR!,
			AUTH_TOKEN: process.env.AUTH_TOKEN!
		};
	}
}
