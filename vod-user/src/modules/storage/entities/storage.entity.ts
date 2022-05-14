import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { S3File } from './file.entity';

@Entity()
export class S3Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bucket: string;

  @Column({ type: 'bigint', default: 2 * 1024 * 1024 * 1024 })
  space: number; //in bytes

  @Column({ type: 'bigint', default: 0 })
  usedSpace: number; // in bytes

  @OneToMany(() => S3File, (file) => file.storage)
  files: S3File[];

  @Column()
  userId: number;
  @OneToOne(() => User, (user) => user.storage)
  @JoinColumn()
  user: User;
}
