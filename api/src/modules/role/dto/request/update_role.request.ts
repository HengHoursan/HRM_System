import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdateRoleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).optional(),
});

export class UpdateRoleRequest extends createZodDto(UpdateRoleSchema) {}
