import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const ResetPasswordSchema = z.object({
  userId: z.number().int().positive(),
  newPassword: z.string().min(6),
});

export class ResetPasswordRequest extends createZodDto(ResetPasswordSchema) {}
