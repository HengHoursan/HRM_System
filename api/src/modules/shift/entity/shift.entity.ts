import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';

@Entity('shifts')
export class Shift extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 100, name: 'start_time' })
  startTime: string;

  @Column({ type: 'varchar', length: 100, name: 'end_time' })
  endTime: string;

  @Column({ type: 'int', name: 'break_minutes' })
  breakMinutes: number;

  @Column({ type: 'int', name: 'grace_period_minutes', default: 0 })
  gracePeriodMinutes: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;
}
