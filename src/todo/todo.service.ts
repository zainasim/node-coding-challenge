import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Todo } from './schemas/todo.schema';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UserService } from 'src/users/users.service';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name)
    private todoModel: mongoose.Model<Todo>,
    private userService: UserService
  ) {}

  async findAll(): Promise<Todo[]> {
    const todos = await this.todoModel.find();
    return todos;
  }

  async create(todo: CreateTodoDto): Promise<Todo> {
    try {
      const { userId } = todo;
      
      const user = await this.userService.getById(userId);
      if (!user) {
        throw new UnauthorizedException('User with this UserID does not exist');
      }
  
      const res = await this.todoModel.create(todo);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async findTasksById(userId: string): Promise<Todo[]> {
    const todo = await this.todoModel.find({ userId });

    if (!todo) {
      throw new NotFoundException('Todo not found.');
    }

    return todo;
  }

  async updateById(id: string, todo: UpdateTodoDto): Promise<Todo> {
    return await this.todoModel.findByIdAndUpdate(id, todo, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<Todo> {
    return await this.todoModel.findByIdAndDelete(id);
  }

  async getTasks(
    userId: string | null,
    page: number = 1,
    limit: number = 10,
    status: string | null,
  ): Promise<Todo[]> {
    const skip = (page - 1) * limit;

    const query: any = {};

    if (userId !== null) {
      query.userId = userId; // Add additional conditions based on your user model
    }

    if (status !== null) {
      query.status = status;
    }

    return this.todoModel.find(query).skip(skip).limit(limit).exec();
  }
}
