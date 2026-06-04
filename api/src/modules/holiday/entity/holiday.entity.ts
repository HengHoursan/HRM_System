import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@/common/entity/base.entity';

@Entity('holidays')
export class Holiday extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'date', name: 'holiday_date' })
  holidayDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', name: 'is_paid', default: true })
  isPaid: boolean;

  @Column({ type: 'boolean', default: true })
  status: boolean;
}
