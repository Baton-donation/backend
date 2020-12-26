import {InjectQueue} from '@nestjs/bull';
import {Injectable} from '@nestjs/common';
import {Queue} from 'bull';

@Injectable()
export class DownloadsService {
	constructor(@InjectQueue('downloads') private readonly downloadsQueue: Queue) {}

	async get(jobId: string) {
		return this.downloadsQueue.getJob(jobId);
	}

	async create() {
		const {id} = await this.downloadsQueue.add({});

		return {id};
	}
}
