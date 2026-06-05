import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdateHolidaySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).optional(),
  holidayDate: z.string().refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(val) >= today;
  }, { message: 'holidayDate must be today or in the future' }).optional(),
  description: z.string().optional(),
  isPaid: z.boolean().optional(),
});

export class UpdateHolidayRequest extends createZodDto(UpdateHolidaySchema) {}
