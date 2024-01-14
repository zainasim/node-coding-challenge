import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Schema({
  timestamps: true,
})
export class Todo {
  @Prop({ required: true })
  userId: ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'Pending' })
  status: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
