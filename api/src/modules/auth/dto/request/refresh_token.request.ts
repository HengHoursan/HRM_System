import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export class RefreshTokenRequest extends createZodDto(RefreshTokenSchema) {}
