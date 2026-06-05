import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HolidayRepository } from '../repository/holiday.repository';
import { PaginationMeta, PaginationRequest } from '@/common/dto';
import { Holiday } from '../entity/holiday.entity';
import {
  CreateHolidayRequest,
  UpdateHolidayRequest,
  UpdateHolidayStatusRequest,
} from '@/modules/holiday/dto';
import { DateConvertor } from '@/common/util/helper';

@Injectable()
export class HolidayService {
  constructor(private readonly holidayRepository: HolidayRepository) {}

  async create(
    request: CreateHolidayRequest,
    currentUserId: number | null = null,
  ): Promise<Holiday> {
    // Check if holiday with same name exists
    const existingByName = await this.holidayRepository.findByName(
      request.name,
    );
    if (existingByName) {
      throw new ConflictException(
        `Holiday with name "${request.name}" already exists`,
      );
    }

    const convertedDate = DateConvertor(request.holidayDate);
    if (!convertedDate) {
      throw new BadRequestException('Invalid holiday date format');
    }

    // Check if holiday with same date exists
    const existingByDate =
      await this.holidayRepository.findByDate(convertedDate);
    if (existingByDate) {
      throw new ConflictException(
        `Holiday on "${request.holidayDate}" already exists`,
      );
    }

    // Create holiday
    const holiday = this.holidayRepository.create({
      ...request,
      holidayDate: convertedDate,
    });
    holiday.createdBy = currentUserId;
    return this.holidayRepository.save(holiday);
  }

  async findAllWithPagination(
    request: PaginationRequest,
  ): Promise<[Holiday[], PaginationMeta]> {
    const [holidays, totalItems] =
      await this.holidayRepository.findWithPagination(request);

    const meta = new PaginationMeta(
      request.page || 1,
      request.limit || 10,
      totalItems,
      request.sortBy || 'createdAt',
      request.sortOrder || 'DESC',
    );

    return [holidays, meta];
  }

  async findOne(id: number): Promise<Holiday> {
    const holiday = await this.holidayRepository.findById(id);
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    return holiday;
  }

  async update(
    id: number,
    request: UpdateHolidayRequest,
    currentUser: number | null = null,
  ): Promise<Holiday> {
    // Find existing holiday
    const existingHoliday = await this.holidayRepository.findOne({
      where: { id },
    });
    if (!existingHoliday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }

    if (request.name && request.name !== existingHoliday.name) {
      const existingByName = await this.holidayRepository.findByName(
        request.name,
      );
      if (existingByName && existingByName.id !== id) {
        throw new ConflictException(
          `Holiday with name "${request.name}" already exists`,
        );
      }
    }

    if (request.holidayDate) {
      const holidayDate = DateConvertor(request.holidayDate);

      if (!holidayDate) {
        throw new BadRequestException('Invalid holiday date format');
      }

      if (
        holidayDate.getTime() !== existingHoliday.holidayDate.getTime() &&
        (await this.holidayRepository.findByDate(holidayDate))
      ) {
        throw new ConflictException(
          `Holiday on "${request.holidayDate}" already exists`,
        );
      }

      existingHoliday.holidayDate = holidayDate;
    }
    this.holidayRepository.merge(existingHoliday, {
      ...request,
      holidayDate: existingHoliday.holidayDate,
    });
    existingHoliday.updatedBy = currentUser;
    return this.holidayRepository.save(existingHoliday);
  }
  async toggleStatus(
    id: number,
    request: UpdateHolidayStatusRequest,
    currentUser: number | null = null,
  ): Promise<Holiday> {
    const holiday = await this.holidayRepository.findById(id);
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }

    this.holidayRepository.merge(holiday, request);
    holiday.updatedBy = currentUser;
    return this.holidayRepository.save(holiday);
  }

  async delete(id: number, currentUser: number | null = null): Promise<void> {
    const holiday = await this.holidayRepository.findById(id);
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }

    holiday.deletedBy = currentUser;
    await this.holidayRepository.save(holiday);
    await this.holidayRepository.softRemove(holiday);
  }

  async findActiveHolidays(): Promise<Holiday[]> {
    return this.holidayRepository.findActiveHolidays();
  }

  async findUpcomingHolidays(): Promise<Holiday[]> {
    return this.holidayRepository.findUpcomingHolidays();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Holiday[]> {
    return this.holidayRepository.findByDateRange(startDate, endDate);
  }
}
