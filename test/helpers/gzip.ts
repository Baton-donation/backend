import * as zlib from 'zlib';
import {Test} from 'supertest';
import * as ndjson from 'ndjson';

export const decompressNDJSON = async <T>(request: Test) => {
	const gzip = zlib.createGunzip();
	const buffer: T[] = [];

	return new Promise<T[]>((resolve, reject) => {
		request.pipe(gzip).pipe(ndjson.parse())
			.on('data', data => buffer.push(data))
			.on('end', () => {
				resolve(buffer);
			})
			.on('error', error => {
				reject(error);
			});
	});
};
