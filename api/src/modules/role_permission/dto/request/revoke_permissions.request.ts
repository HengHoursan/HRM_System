import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

const RevokePermissionsSchema = z.object({
  roleId: z.number().int().positive(),
  permissionIds: z.array(z.number().int().positive()),
});

export class RevokePermissionsRequest extends createZodDto(RevokePermissionsSchema) {}
