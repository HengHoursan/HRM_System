import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreateRoleSchema = z.object({
  name: z.string().min(1),
});

export class CreateRoleRequest extends createZodDto(CreateRoleSchema) {}
