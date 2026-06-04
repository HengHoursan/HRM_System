import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdateProfileSchema = z.object({
  username: z.string().min(3).max(60),
  email: z.string().email(),
  photo: z.string().optional(),
});

export class UpdateProfileRequest extends createZodDto(UpdateProfileSchema) {}
