import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Todo from '../domain/todo.entity';
import { TodoRepository } from '../repository/todo.repository';

const relationshipNames = [];

@Injectable()
export class TodoService {
  logger = new Logger('TodoService');

  constructor(@InjectRepository(TodoRepository) private todoRepository: TodoRepository) {}

  async findById(id: string): Promise<Todo | undefined> {
    const options = { relations: relationshipNames };
    return await this.todoRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Todo>): Promise<Todo | undefined> {
    return await this.todoRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Todo>): Promise<[Todo[], number]> {
    options.relations = relationshipNames;
    return await this.todoRepository.findAndCount(options);
  }

  async save(todo: Todo): Promise<Todo | undefined> {
    return await this.todoRepository.save(todo);
  }

  async update(todo: Todo): Promise<Todo | undefined> {
    return await this.save(todo);
  }

  async delete(todo: Todo): Promise<Todo | undefined> {
    return await this.todoRepository.remove(todo);
  }
}
