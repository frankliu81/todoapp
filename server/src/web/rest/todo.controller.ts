import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Todo from '../../domain/todo.entity';
import { TodoService } from '../../service/todo.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/todos')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('todos')
export class TodoController {
  logger = new Logger('TodoController');

  constructor(private readonly todoService: TodoService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Todo
  })
  async getAll(@Req() req: Request): Promise<Todo[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.todoService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Todo
  })
  async getOne(@Param('id') id: string): Promise<Todo> {
    return await this.todoService.findById(id);
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create todo' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Todo
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() todo: Todo): Promise<Todo> {
    const created = await this.todoService.save(todo);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Todo', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update todo' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Todo
  })
  async put(@Req() req: Request, @Body() todo: Todo): Promise<Todo> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Todo', todo.id);
    return await this.todoService.update(todo);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete todo' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Todo> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Todo', id);
    const toDelete = await this.todoService.findById(id);
    return await this.todoService.delete(toDelete);
  }
}
