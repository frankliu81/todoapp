/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { ApiModelProperty } from '@nestjs/swagger';

/**
 * A Todo.
 */
@Entity('todo')
export default class Todo extends BaseEntity {
  @Column({ name: 'name', nullable: true })
  name: string;

  // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
