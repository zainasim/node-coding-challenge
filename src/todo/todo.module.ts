import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoSchema } from './schemas/todo.schema';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }])
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
