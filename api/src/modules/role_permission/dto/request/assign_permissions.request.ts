import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const AssignPermissionsSchema = z.object({
  roleId: z.number().int().positive(),
  permissionIds: z.array(z.number().int().positive()),
});

export class AssignPermissionsRequest extends createZodDto(AssignPermissionsSchema) {}
