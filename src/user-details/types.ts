import {IsObject, IsUUID} from 'class-validator';

export class UserDetailsDto {
	@IsUUID('4')
	uuid!: string;

	@IsObject()
	data!: Record<string, unknown>;
}

export class DeleteParameters {
	@IsUUID('4')
	uuid!: string;
}
