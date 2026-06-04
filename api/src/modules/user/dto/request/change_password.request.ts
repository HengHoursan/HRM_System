import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export class ChangePasswordRequest extends createZodDto(ChangePasswordSchema) {}
