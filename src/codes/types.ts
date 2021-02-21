import {IsString} from 'class-validator';

export class ValidateCodeParameters {
	@IsString()
	code!: string;
}
