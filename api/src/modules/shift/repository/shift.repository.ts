import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { Shift } from '../entity/shift.entity';
import { PaginationRequest } from '@/common/dto';

@Injectable()
export class ShiftRepository extends Repository<Shift> {
  constructor(private readonly dataSource: DataSource) {
    super(Shift, dataSource.createEntityManager());
  }

  async findWithPagination(
    pagination: PaginationRequest,
  ): Promise<[Shift[], number]> {
    const { page, limit, sortBy, sortOrder, search, filter } = pagination;
    const query = this.createQueryBuilder('shift');

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('shift.name LIKE :search', { search: `%${search}%` })
            .orWhere('shift.code LIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (filter && filter.status !== undefined) {
      query.andWhere('shift.status = :status', { status: filter.status });
    }

    query.orderBy(`shift.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    query.skip((page - 1) * limit);
    query.take(limit);

    return query.getManyAndCount();
  }

  async checkIfExists(name: string, code: string): Promise<Shift | null> {
    return this.createQueryBuilder('shift')
      .where('shift.name = :name OR shift.code = :code', { name, code })
      .getOne();
  }

  async findActiveShifts(): Promise<Shift[]> {
    return this.find({ where: { status: true } });
  }
}
