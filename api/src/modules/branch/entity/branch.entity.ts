import { BaseEntity } from '@/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('branches')
export class Branch extends BaseEntity {
  @Column({ type: 'varchar', unique: true, length: 100 })
  name: string;

  @Column({
    type: 'varchar',
    length: 500,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 15,
    unique: true,
  })
  phone: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email?: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;
}
