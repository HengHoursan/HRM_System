import { Module } from '@nestjs/common';
import { BranchModule } from '../branch/branch.module';
import { ActivityLogModule } from '../activity_log/activity_log.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from '../permission/permission.module';
import { RolePermissionModule } from '../role_permission/role_permission.module';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { JwtModule } from '../jwt/jwt.module';
import { TokenBlacklistModule } from '../token_blacklist/token_blacklist.module';
import { UploadModule } from '../upload/upload.module';
import { ShiftModule } from '@/shift/shift.module';
import {HolidayModule} from '@/holiday/holiday.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    AuthModule,
    CloudinaryModule,
    JwtModule,
    TokenBlacklistModule,
    UploadModule,
    ActivityLogModule,
    BranchModule,
    ShiftModule,
    HolidayModule,
  ],
  exports: [
    UserModule,
    RoleModule,
    PermissionModule,
    RolePermissionModule,
    AuthModule,
    CloudinaryModule,
    JwtModule,
    TokenBlacklistModule,
    UploadModule,
    ActivityLogModule,
    BranchModule,
    ShiftModule,
    HolidayModule
  ],
})
export class CoreModule {}
