import {Controller, Get, HttpException, HttpStatus, Param, Post, Res} from '@nestjs/common';
import {Response} from 'express';
import {DownloadsService} from './downloads.service';
import {GetParameters} from './types';

@Controller('downloads')
export class DownloadsController {
	constructor(private readonly downloadsService: DownloadsService) {}

	@Get(':id')
	async getDownload(@Param() parameters: GetParameters, @Res() response: Response) {
		const download = await this.downloadsService.get(parameters.id);

		if (!download) {
			throw new HttpException('Download does not exist', HttpStatus.NOT_FOUND);
		}

		if (download.progress() === 1) {
			// Return file
			const stream = await this.downloadsService.getStream(parameters.id);

			response.set({
				'Content-Type': 'application/gzip'
			});

			return stream.pipe(response);
		}

		if (download.progress() === -1) {
			throw new HttpException('Download errored out', HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return {progress: download.progress()};
	}

	@Post()
	async createNewDownload() {
		return this.downloadsService.create();
	}
}
