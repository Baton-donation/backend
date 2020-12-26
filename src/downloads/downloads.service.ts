import {InjectQueue} from '@nestjs/bull';
import {Injectable} from '@nestjs/common';
import {Queue} from 'bull';
import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuidv4} from 'uuid';
import {ConfigService} from 'src/config/config.service';
import {IJobData} from './types';

@Injectable()
export class DownloadsService {
	constructor(@InjectQueue('downloads') private readonly downloadsQueue: Queue, private readonly config: ConfigService) {}

	async get(jobId: string) {
		return this.downloadsQueue.getJob(jobId);
	}

	async create() {
		const {id} = await this.downloadsQueue.add({uuid: uuidv4()});

		return {id};
	}

	async getStream(jobId: string) {
		const job = await this.downloadsQueue.getJob(jobId);

		if (!job) {
			throw new Error('Job not found.');
		}

		return fs.createReadStream(path.join(this.config.env.DATA_DIR, `${(job.data as IJobData).uuid}.gz`));
	}
}
