import { Injectable } from '@nestjs/common';
import { DataSource, Repository, Brackets } from 'typeorm';
import { Branch } from '../entity/branch.entity';
import { PaginationRequest } from '@/common/dto';

@Injectable()
export class BranchRepository extends Repository<Branch> {
  constructor(private dataSource: DataSource) {
    super(Branch, dataSource.createEntityManager());
  }
  async findWithPagination(
    pagination: PaginationRequest,
  ): Promise<[Branch[], number]> {
    const { page, limit, sortBy, sortOrder, search, filter } = pagination;
    const query = this.createQueryBuilder('branch');

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('branch.name ILIKE :search', { search: `%${search}%` })
            .orWhere('branch.address ILIKE :search', { search: `%${search}%` })
            .orWhere('branch.phone ILIKE :search', { search: `%${search}%` })
            .orWhere('branch.email ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (filter && filter.status !== undefined) {
      query.andWhere('branch.status = :status', { status: filter.status });
    }

    query.orderBy(
      `branch.${sortBy}`,
      sortOrder.toUpperCase() as 'ASC' | 'DESC',
    );
    query.skip((page - 1) * limit);
    query.take(limit);

    return query.getManyAndCount();
  }

  async checkIfExists(phone: string, email?: string): Promise<Branch | null> {
    const query = this.createQueryBuilder('branch').where(
      'branch.phone = :phone',
      { phone },
    );

    if (email) {
      query.orWhere('branch.email = :email', { email });
    }

    return query.getOne();
  }

  async findActiveBranches(): Promise<Branch[]> {
    return this.find({
      where: { status: true },
      order: { name: 'ASC' },
      select: ['id', 'name', 'address'],
    });
  }

  async toggleStatus(id: number, status: boolean): Promise<void> {
    await this.update(id, { status });
  }
}
