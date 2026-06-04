import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const CreatePermissionSchema = z.object({
  name: z.string().min(1),
  displayName: z.string().min(1),
  group: z.string().optional(),
  sort: z.number().int().optional(),
});

export class CreatePermissionRequest extends createZodDto(CreatePermissionSchema) {}
