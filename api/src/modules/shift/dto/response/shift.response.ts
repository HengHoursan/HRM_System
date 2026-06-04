import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ShiftResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose({ name: 'start_time' })
  startTime: string;

  @Expose({ name: 'end_time' })
  endTime: string;

  @Expose({ name: 'break_minutes' })
  breakMinutes: number;

  @Expose()
  status: boolean;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
