import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }

  getTaskById(id: string): Task {
    // try to get task
    const found = this.tasks.find((task) => task.id === id);

    // if not found, throw an error (404 not found)
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    // otherwise, return the found task
    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
    const index: number = this.tasks.findIndex((val) => val.id === id);
    if (index >= 0) {
      const { title, description, status } = updateTaskDto;
      const updateTask: Task = {
        title: title,
        description: description,
        status: status,
        id: id,
      };
      this.tasks[index] = updateTask;
      return updateTask;
    }
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  deleteTask(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  //   create(createTaskDto: CreateTaskDto) {
  //     return 'This action adds a new task';
  //   }

  //   findAll() {
  //     return this.tasks;
  //     // return `This action returns all tasks`;
  //   }

  //   findOne(id: number) {
  //     return `This action returns a #${id} task`;
  //   }

  //   update(id: number, updateTaskDto: UpdateTaskDto) {
  //     return `This action updates a #${id} task`;
  //   }

  //   remove(id: number) {
  //     return `This action removes a #${id} task`;
  //   }
}
