import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdateUserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
  email: z.string().email().optional(),
  roleId: z.number().int().positive().optional(),
  photo: z.string().optional(),
});

export class UpdateUserRequest extends createZodDto(UpdateUserSchema) {}
