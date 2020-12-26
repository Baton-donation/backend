import {Controller, Get, HttpException, HttpStatus, Param, Post} from '@nestjs/common';
import {DownloadsService} from './downloads.service';
import {GetParameters} from './types';

@Controller('downloads')
export class DownloadsController {
	constructor(private readonly downloadsService: DownloadsService) {}

	@Get(':id')
	async getDownload(@Param() parameters: GetParameters) {
		const download = await this.downloadsService.get(parameters.id);

		if (!download) {
			throw new HttpException('Download does not exist', HttpStatus.NOT_FOUND);
		}

		if (download.progress() === 1) {
			// TODO: return file
		}

		return {progress: download.progress()};
	}

	@Post()
	async createNewDownload() {
		return this.downloadsService.create();
	}
}
