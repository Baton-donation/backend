import {Process, Processor} from '@nestjs/bull';
import {Logger} from '@nestjs/common';
import {Job} from 'bull';
import * as zlib from 'zlib';
import * as path from 'path';
import * as fs from 'fs';
import * as makeDir from 'make-dir';
import {PrismaService} from 'src/prisma/prisma.service';
import {ConfigService} from 'src/config/config.service';
import {IJobData} from './types';

const CHUNK_SIZE = 10;

@Processor('downloads')
export class DownloadsProcessor {
	private readonly logger = new Logger(DownloadsProcessor.name);

	constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}

	@Process()
	async handleDownload(job: Job) {
		const data = job.data as IJobData;

		this.logger.debug(`Started preparing download with ${JSON.stringify(data)}...`);

		await makeDir(this.config.env.DATA_DIR);

		try {
			const gzip = zlib.createGzip();
			const out = fs.createWriteStream(path.join(this.config.env.DATA_DIR, `${data.uuid}.gz`));
			gzip.pipe(out);

			const count = await this.prisma.sentence.count();

			for (let i = 0; i < count; i += CHUNK_SIZE) {
				// eslint-disable-next-line no-await-in-loop
				const rows = await this.prisma.sentence.findMany({
					skip: i,
					take: CHUNK_SIZE,
					orderBy: {
						createdAt: 'desc'
					}
				});

				// Write
				rows.forEach(row => gzip.write(JSON.stringify(row, undefined, 0) + '\n'));

				// Update job progress
				// eslint-disable-next-line no-await-in-loop
				await job.progress(i / count);
			}

			gzip.end();

			this.logger.debug('Download has been processed.');
			await job.progress(1);
		} catch (error: unknown) {
			await job.progress(-1);

			this.logger.error((error as Error).message, (error as Error).stack);
		}
	}
}
