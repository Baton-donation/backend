import {IsString, IsUUID} from 'class-validator';

export class UserDetailsDto {
	@IsUUID('4')
	uuid!: string;

	@IsString()
	encryptedData!: string;
}

export class DeleteParameters {
	@IsUUID('4')
	uuid!: string;
}
