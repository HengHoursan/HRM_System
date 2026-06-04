import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateBranchSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().optional(),
});

export class CreateBranchRequest extends createZodDto(CreateBranchSchema) {}