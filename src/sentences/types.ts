import {IsNotEmpty, IsUUID} from 'class-validator';

export class SentenceDto {
	@IsUUID('4')
	uuid!: string;

	@IsNotEmpty()
	content!: string;
}

export class DeleteParameters {
	@IsUUID('4')
	uuid!: string;
}
