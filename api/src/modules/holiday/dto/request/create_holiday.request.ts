import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateHolidaySchema = z.object({
  name: z.string().min(1),
  holidayDate: z.string().date().refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(val) >= today;
  }, { message: 'holidayDate must be today or in the future' }),
  description: z.string().optional(),
  isPaid: z.boolean().optional(),
  status: z.boolean().optional(),
});

export class CreateHolidayRequest extends createZodDto(CreateHolidaySchema) {}
