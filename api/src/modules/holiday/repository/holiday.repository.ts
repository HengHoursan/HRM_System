import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository, ILike, MoreThanOrEqual, Between } from 'typeorm';
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
          qb.where('holiday.name ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('holiday.description ILIKE :search', {
            search: `%${search}%`,
          });
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

  async findById(id: number): Promise<Holiday | null> {
    return this.findOne({ where: { id } as any });
  }

  async findByName(name: string): Promise<Holiday | null> {
    return this.findOne({ where: { name } as any });
  }

  async findByDate(holidayDate: Date): Promise<Holiday | null> {
    return this.findOne({ where: { holidayDate } as any });
  }

  async existsByName(name: string): Promise<boolean> {
    return this.exists({ where: { name } });
  }

  async existsByDate(holidayDate: Date): Promise<boolean> {
    return this.exists({ where: { holidayDate } });
  }

  async findActiveHolidays(): Promise<Holiday[]> {
    return this.find({ where: { status: true } });
  }

  async findUpcomingHolidays(): Promise<Holiday[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.find({
      where: {
        holidayDate: MoreThanOrEqual(today),
        status: true,
      } as any,
      order: {
        holidayDate: 'ASC',
      } as any,
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Holiday[]> {
    return this.find({
      where: {
        holidayDate: Between(startDate, endDate),
      } as any,
      order: {
        holidayDate: 'ASC',
      } as any,
    });
  }

  async toggleStatus(id: number, status: boolean): Promise<void> {
    await this.update(id, { status });
  }
}
