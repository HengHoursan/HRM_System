import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email(),
  roleId: z.number().int().positive(),
  photo: z.string().optional(),
});

export class CreateUserRequest extends createZodDto(CreateUserSchema) {}
