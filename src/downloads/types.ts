import {IsNotEmpty} from 'class-validator';

export class GetParameters {
	@IsNotEmpty()
	id!: string;
}

export interface IJobData {
	uuid: string;

}
