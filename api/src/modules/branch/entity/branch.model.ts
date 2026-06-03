import { BaseEntity } from "@/common/entity/base.entity";
import { Column, Entity} from "typeorm";

@Entity('branches')
export class Branch extends BaseEntity {
  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ unique: true })
  phone: string;

  @Column({
    unique: true,
    nullable: true,
  })
  email?: string;

  @Column({ default: true })
  status: boolean;
}