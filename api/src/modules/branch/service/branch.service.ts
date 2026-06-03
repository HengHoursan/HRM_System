import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BranchRepository } from '../repository/branch.respository';
import {
  CreateBranchRequest,
  UpdateBranchRequest,
} from '@/modules/branch/dto';
import { PaginationRequest } from '@/common/dto';
import { Branch } from '../entity/branch.model';
import { PaginationMeta } from '@/common/dto/response/pagination.response';

@Injectable()
export class BranchService {
  constructor(private readonly branchRepository: BranchRepository) {}

  async create(request: CreateBranchRequest, currentUserId: number | null = null): Promise<Branch> {
    const existingBranch = await this.branchRepository.checkIfExists(
      request.phone,
      request.email,
    );

    if (existingBranch) {
      if (existingBranch.phone === request.phone) {
        throw new ConflictException('Branch with this phone already exists');
      }
      if (request.email && existingBranch.email === request.email) {
        throw new ConflictException('Branch with this email already exists');
      }
    }

    const branch = this.branchRepository.create(request);
    branch.createdBy = currentUserId;
    return this.branchRepository.save(branch);
  }

  async findAllWithPagination(
    request: PaginationRequest,
  ): Promise<[Branch[], PaginationMeta]> {
    const [branches, totalItems] =
      await this.branchRepository.findWithPagination(request);

    const meta = new PaginationMeta(
      request.page || 1,
      request.limit || 10,
      totalItems,
      request.sortBy || 'createdAt',
      request.sortOrder || 'DESC',
    );

    return [branches, meta];
  }

  async findOne(id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOne({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    return branch;
  }

  async update(
    id: number,
    request: UpdateBranchRequest,
    currentUserId: number | null = null,
  ): Promise<Branch> {
    const branch = await this.branchRepository.findOne({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    if (request.phone || request.email) {
      const existingBranch = await this.branchRepository.checkIfExists(
        request.phone || branch.phone,
        request.email || branch.email,
      );

      if (existingBranch && existingBranch.id !== id) {
        if (request.phone && existingBranch.phone === request.phone) {
          throw new ConflictException('Branch with this phone already exists');
        }
        if (request.email && existingBranch.email === request.email) {
          throw new ConflictException('Branch with this email already exists');
        }
      }
    }

    Object.assign(branch, request);
    branch.updatedBy = currentUserId;
    return this.branchRepository.save(branch);
  }

  async updateStatus(id: number, status: boolean, currentUserId: number | null = null): Promise<void> {
    const branch = await this.branchRepository.findOne({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    branch.status = status;
    branch.updatedBy = currentUserId;
    await this.branchRepository.save(branch);
  }

  async softDelete(
    id: number,
    currentUserId: number | null = null,
  ): Promise<void> {
    const branch = await this.branchRepository.findOne({ where: { id } });
    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    branch.deletedBy = currentUserId;
    await this.branchRepository.save(branch);
    await this.branchRepository.softRemove(branch);
  }

  async forceDelete(id: number): Promise<void> {
    const result = await this.branchRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }
  }

  async getActiveBranches(): Promise<Branch[]> {
    return this.branchRepository.findActiveBranches();
  }
}
