import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const UpdatePermissionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).optional(),
  displayName: z.string().min(1).optional(),
  group: z.string().optional(),
  sort: z.number().int().optional(),
});

export class UpdatePermissionRequest extends createZodDto(UpdatePermissionSchema) {}
