import { IsInt, IsNotEmpty, IsNumberString, IsString, Min } from 'class-validator';

export class CreateStorageDto {
  @IsString()
  bucket: string;
}

export class VerifyUploadAccessDto {
  @IsNumberString()
  size: number;
}

export class SuccessfulUploadCallbackDto {
  @IsString()
  ID: string;

  @IsInt()
  Size: number;

  @IsNotEmpty()
  MetaData: {
    filename: string;
    filetype: string;
    name: string;
  };
}
