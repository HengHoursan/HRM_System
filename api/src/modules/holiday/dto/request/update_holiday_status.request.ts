import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdateHolidayStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.boolean(),
});

export class UpdateHolidayStatusRequest extends createZodDto(UpdateHolidayStatusSchema) {}
