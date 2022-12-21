import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with id ${id} cannot be found!`);
    }
    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const foundTask = await this.tasksRepository.delete({ id, user });

    if (foundTask.affected === 0) {
      throw new NotFoundException(`Task with id ${id} cannot be found!`);
    }
  }

  async updateTaskStatus(
    id: string,
    updateStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    const { status } = updateStatusDto;
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
