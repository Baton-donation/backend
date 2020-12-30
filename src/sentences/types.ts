import {IsNotEmpty, IsOptional, IsUUID} from 'class-validator';

export class SentenceDto {
	@IsUUID('4')
	uuid!: string;

	@IsUUID('4')
	@IsOptional()
	anonymousUUID!: string | null;

	@IsNotEmpty()
	content!: string;
}

export class DeleteParameters {
	@IsUUID('4')
	uuid!: string;
}
