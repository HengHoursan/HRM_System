import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdateBranchSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export class UpdateBranchRequest extends createZodDto(UpdateBranchSchema) {}