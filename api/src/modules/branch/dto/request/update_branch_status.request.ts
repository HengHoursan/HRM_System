import { IdRequest } from "@/common/dto";
import { IsBoolean} from "class-validator";

export class UpdateBranchStatusRequest extends IdRequest {
    @IsBoolean()
    status: boolean;
}