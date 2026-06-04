import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdateShiftSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).optional(),
  code: z.string().min(1).optional(),
  startTime: z.string().min(1).optional(),
  endTime: z.string().min(1).optional(),
  breakMinutes: z.number().int().min(0).optional(),
  gracePeriodMinutes: z.number().int().min(0).optional(),
}).refine(data => {
  if (data.startTime && data.endTime) {
    return data.startTime < data.endTime;
  }
  return true;
}, {
  message: 'startTime must be before endTime',
  path: ['startTime'],
});

export class UpdateShiftRequest extends createZodDto(UpdateShiftSchema) {}
