import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdateShiftStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.boolean(),
});

export class UpdateShiftStatusRequest extends createZodDto(UpdateShiftStatusSchema) {}
