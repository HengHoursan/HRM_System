import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdateBranchStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.boolean(),
});

export class UpdateBranchStatusRequest extends createZodDto(UpdateBranchStatusSchema) {}