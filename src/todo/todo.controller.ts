import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './schemas/todo.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('todo')
@UseGuards(AuthGuard())
export class TodoController {
  constructor(private todoService: TodoService) {}

  //this can only be seen by Admin
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  async getAlltodos(@Query() query): Promise<{}> {
    const { userId, status } = query;
    const { page, limit } = query;

    const tasks: Todo[] = await this.todoService.getTasks(
      userId || null, // Pass null if userId is not provided
      parseInt(page),
      parseInt(limit),
      status || null, // Pass null if status is not provided
    );

    return {
      tasks,
      page,
      limit,
    };
  }

  @UseGuards(RolesGuard)
  @Roles('admin, client')
  @Post('/create')
  async createtodo(
    @Body()
    todo: CreateTodoDto,
    @CurrentUser() currentUser: any,
  ): Promise<Todo> {
    // Check if the logged-in user and userId in the body are the same
    if (currentUser.id !== todo.userId) {
      throw new ForbiddenException('Log in user and user creating task should be same');
    }
    return this.todoService.create(todo);
  }

  //Get tasks by specific user
  @UseGuards(RolesGuard)
  @Roles('admin, client') 
  @Get(':userId')
  async getAllTasksByUserId(
    @Param('userId')
    userId: string,
    @CurrentUser() currentUser: any,
  ): Promise<Todo[]> {
    // Check if the logged-in user and userId in the body are the same
    if (currentUser.id !== userId) {
      throw new ForbiddenException('Log in user and user creating task should be same');
    }
    return this.todoService.findTasksById(userId);
  }

  @Put(':id')
  async updateTodo(
    @Param('id')
    id: string,
    @Body()
    todo: UpdateTodoDto,
  ): Promise<Todo> {
    return this.todoService.updateById(id, todo);
  }

  @Delete(':id')
  async deleteTodo(
    @Param('id')
    id: string,
  ): Promise<Todo> {
    return this.todoService.deleteById(id);
  }
}
