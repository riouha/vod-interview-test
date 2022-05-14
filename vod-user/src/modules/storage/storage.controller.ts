import { Controller, ForbiddenException, Get, Query, Body, Post } from '@nestjs/common';
import { GetUser } from 'src/lib/decorators/get-user.decorator';
import { StorageService } from './services/storage.service';
import { ITokenPayload } from 'src/modules/auth/types/token-payload.interface';
import { SuccessfulUploadCallbackDto, VerifyUploadAccessDto } from './dtos/storage.dto';

@Controller('/storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Get('/verify-upload')
  async verifyUpload(@GetUser() token: ITokenPayload, @Query() query: VerifyUploadAccessDto) {
    const storage = await this.storageService.getUserStorage(token.sub);
    console.log(
      'sasad',

      +storage.usedSpace + +query.size > +storage.space,
    );

    if (+storage.usedSpace + +query.size > +storage.space) throw new ForbiddenException('not enough space');
    return storage;
  }

  @Post('/successful-upload')
  async successfulUploadCallbsck(@GetUser() token: ITokenPayload, @Body() body: SuccessfulUploadCallbackDto) {
    console.log(`upload ${body.ID} was seccessful`);
    return this.storageService.uploadFileToS3(body, token.sub);
  }
}
