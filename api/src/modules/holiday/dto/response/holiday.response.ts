import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class HolidayResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose({ name: 'holiday_date' })
  holidayDate: string;

  @Expose()
  description: string;

  @Expose({ name: 'is_paid' })
  isPaid: boolean;

  @Expose()
  status: boolean;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
