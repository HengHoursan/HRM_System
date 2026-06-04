import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const RegisterSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email(),
  roleId: z.number().int().positive(),
});

export class RegisterRequest extends createZodDto(RegisterSchema) {}
