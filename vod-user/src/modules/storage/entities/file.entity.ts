import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { S3Storage } from './storage.entity';

@Entity()
export class S3File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  uploadId: string;

  @Column({ type: 'bigint' })
  size: number; //in bytes

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  storageId: number;
  @ManyToOne(() => S3Storage, (storage) => storage.files)
  storage: S3Storage;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.storage)
  user: User;
}
