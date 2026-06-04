import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BranchResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  address: string;

  @Expose()
  phone: string;

  @Expose()
  email: string;

  @Expose()
  status: boolean;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose({ name: 'deleted_at' })
  deletedAt: Date | null;

  @Expose({ name: 'created_by' })
  createdBy: number | null;

  @Expose({ name: 'updated_by' })
  updatedBy: number | null;

  @Expose({ name: 'deleted_by' })
  deletedBy: number | null;
}