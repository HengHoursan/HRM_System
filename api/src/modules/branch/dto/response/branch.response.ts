import { Exclude, Expose } from "class-transformer";

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

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date | null;

    @Expose()
    createdBy: number | null;

    @Expose()
    updatedBy: number | null;

    @Expose()
    deletedBy: number | null;
}
    