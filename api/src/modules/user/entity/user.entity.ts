import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import {
  BaseEntity,
} from '../../../common/entity/base.entity';
import { Role } from '../../role/entity/role.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  photo: string;

  @Column({ name: 'must_change_password', default: false })
  must_change_password: boolean;
}
