import * as dotenv from 'dotenv';
import {Injectable} from '@nestjs/common';

interface IEnv {
	PUBLIC_KEY: string;
}

@Injectable()
export class ConfigService {
	public env: IEnv;

	constructor() {
		dotenv.config();

		this.env = {
			PUBLIC_KEY: process.env.PUBLIC_KEY as string
		};
	}
}