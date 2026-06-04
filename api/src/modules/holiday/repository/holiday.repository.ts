import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository, ILike } from 'typeorm';
import { Holiday } from '../entity/holiday.entity';
import { PaginationRequest } from '@/common/dto';

@Injectable()
export class HolidayRepository extends Repository<Holiday> {
  constructor(private dataSource: DataSource) {
    super(Holiday, dataSource.createEntityManager());
  }

  async findWithPagination(
    request: PaginationRequest,
  ): Promise<[Holiday[], number]> {
    const { page, limit, sortBy, sortOrder, search, filter } = request;
    const query = this.createQueryBuilder('holiday');

    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('holiday.name ILIKE :search', { search: `%${search}%` })
            .orWhere('holiday.description ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    if (filter) {
      if (filter.status !== undefined) {
        query.andWhere('holiday.status = :status', { status: filter.status });
      }
      if (filter.startDate !== undefined && filter.endDate !== undefined) {
        query.andWhere('holiday.holidayDate BETWEEN :startDate AND :endDate', {
          startDate: filter.startDate,
          endDate: filter.endDate,
        });
      }
      if (filter.isPaid !== undefined) {
        query.andWhere('holiday.isPaid = :isPaid', { isPaid: filter.isPaid });
      }
    }

    query.orderBy(
      `holiday.${sortBy}`,
      sortOrder.toUpperCase() as 'ASC' | 'DESC',
    );
    query.skip((page - 1) * limit);
    query.take(limit);

    return query.getManyAndCount();
  }

  async checkIfExists(
    name?: string,
    holidayDate?: Date,
  ): Promise<Holiday | null> {
    const queryBuilder = this.createQueryBuilder('holiday');
    if (name) {
      queryBuilder.andWhere('holiday.name = :name', { name });
    }
    if (holidayDate) {
      queryBuilder.andWhere('holiday.holidayDate = :holidayDate', {
        holidayDate,
      });
    }
    return queryBuilder.getOne();
  }

  async findActiveHolidays(): Promise<Holiday[]> {
    return this.find({ where: { status: true } });
  }
  async toggleStatus(id: number, status: boolean): Promise<void> {
    await this.update(id, { status });
  }
}
