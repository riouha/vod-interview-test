import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3Storage } from './entities/storage.entity';
import { StorageController } from './storage.controller';
import { StorageService } from './services/storage.service';
import { S3File } from './entities/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([S3Storage, S3File])],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
