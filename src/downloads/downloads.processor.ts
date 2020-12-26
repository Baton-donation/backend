import {Process, Processor} from '@nestjs/bull';
import {Logger} from '@nestjs/common';
import {Job} from 'bull';
import {PrismaService} from 'src/prisma/prisma.service';

@Processor('downloads')
export class DownloadsProcessor {
	private readonly logger = new Logger(DownloadsProcessor.name);

	constructor(private readonly prisma: PrismaService) {}

	@Process()
	async handleDownload(job: Job) {
		this.logger.debug(`Started preparing download with ${JSON.stringify(job.data as Record<string, unknown>)}...`);

		this.logger.debug('Download has been processed.');
		await job.progress(1);
	}
}
