import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Storage } from '../entities/storage.entity';
import { Repository } from 'typeorm';
import { CreateStorageDto, SuccessfulUploadCallbackDto } from '../dtos/storage.dto';
import { S3File } from '../entities/file.entity';
@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(S3Storage) private storageRepo: Repository<S3Storage>,
    @InjectRepository(S3File) private fileRepo: Repository<S3File>,
  ) {}

  async createStorage(dto: CreateStorageDto, userId: number) {
    const duplicate = await this.storageRepo.findOne({ where: { userId } });
    if (duplicate) throw new ConflictException('user already has storage space');

    const storage = new S3Storage();
    storage.bucket = dto.bucket;
    storage.userId = userId;
    return this.storageRepo.save(storage);
  }

  async getStorage(id: number) {
    const storage = await this.storageRepo.findOne({ where: { id } });
    if (!storage) throw new NotFoundException(`storage ${id} not found`);
    return storage;
  }

  async getUserStorage(userId: number) {
    const storage = await this.storageRepo.findOne({ where: { userId } });
    if (!storage) throw new NotFoundException('user storage not found');
    return storage;
  }

  async uploadFileToS3(dto: SuccessfulUploadCallbackDto, userId: number) {
    const storage = await this.getUserStorage(userId);
    const file = new S3File();
    file.storageId = storage.id;
    file.uploadId = dto.ID;
    file.size = dto.Size;
    file.name = dto.MetaData.name ?? dto.MetaData.filename ?? '';
    file.type = dto.MetaData.filetype ?? '';
    file.userId = userId;
    await this.fileRepo.save(file);

    storage.usedSpace = +storage.usedSpace + +file.size;
    await this.storageRepo.save(storage);

    return file;
  }
}
