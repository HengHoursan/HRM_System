import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateShiftSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  breakMinutes: z.number().int().min(0),
  gracePeriodMinutes: z.number().int().min(0).optional(),
}).refine(data => data.startTime < data.endTime, {
  message: 'startTime must be before endTime',
  path: ['startTime'],
});

export class CreateShiftRequest extends createZodDto(CreateShiftSchema) {}
