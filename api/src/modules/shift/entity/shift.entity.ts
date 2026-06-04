import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';

@Entity('shifts')
export class Shift extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, name: 'start_time' })
  startTime: string;

  @Column({ type: 'varchar', length: 100, name: 'end_time' })
  endTime: string;

  @Column({ type: 'int', name: 'break_minutes' })
  breakMinutes: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  status: boolean;
}
