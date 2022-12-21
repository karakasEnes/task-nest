import { TaskStatus } from '../task.model';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export class GetTasksFilterDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
