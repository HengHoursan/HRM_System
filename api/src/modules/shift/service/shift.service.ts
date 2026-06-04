import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShiftRepository } from '../repository/shift.repository';
import {
  CreateShiftRequest,
  UpdateShiftRequest,
  UpdateShiftStatusRequest,
} from '@/modules/shift/dto';
import { PaginationMeta, PaginationRequest } from '@/common/dto';
import { Shift } from '../entity/shift.entity';

@Injectable()
export class ShiftService {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async create(
    request: CreateShiftRequest,
    currentUserId: number | null = null,
  ): Promise<Shift> {
    const existingShift = await this.shiftRepository.checkIfExists(request.name);
    if (existingShift) {
      throw new ConflictException('Shift with this name already exists');
    }
    const shift = this.shiftRepository.create(request);
    shift.createdBy = currentUserId;
    return this.shiftRepository.save(shift);
  }

  async findAllWithPagination(
    request: PaginationRequest,
  ): Promise<[Shift[], PaginationMeta]> {
    const [shifts, totalItems] =
      await this.shiftRepository.findWithPagination(request);

    const meta = new PaginationMeta(
      request.page || 1,
      request.limit || 10,
      totalItems,
      request.sortBy || 'createdAt',
      request.sortOrder || 'DESC',
    );

    return [shifts, meta];
  }

  async findOne(id: number): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return shift;
  }

  async update(
    id: number,
    request: UpdateShiftRequest,
    currentUser: number | null = null,
  ): Promise<Shift> {
    const existingShift = await this.shiftRepository.findOne({ where: { id } });
    if (!existingShift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    if (request.name) {
      const duplicate = await this.shiftRepository.checkIfExists(request.name);
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException('Shift with this name already exists');
      }
    }
    this.shiftRepository.merge(existingShift, request);
    existingShift.updatedBy = currentUser;
    return this.shiftRepository.save(existingShift);
  }

  async toggleStatus(
    id: number,
    request: UpdateShiftStatusRequest,
    currentUser: number | null = null,
  ): Promise<Shift> {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    this.shiftRepository.merge(shift, request);
    shift.updatedBy = currentUser;
    return this.shiftRepository.save(shift);
  }

  async softDelete(
    id: number,
    currentUser: number | null = null,
  ): Promise<void> {
    const shift = await this.shiftRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    shift.deletedBy = currentUser;
    await this.shiftRepository.save(shift);
    await this.shiftRepository.softRemove(shift);
  }

  async forceDelete(id: number): Promise<void> {
    const result = await this.shiftRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
  }

  async findActiveShifts(): Promise<Shift[]> {
    return this.shiftRepository.findActiveShifts();
  }
}
