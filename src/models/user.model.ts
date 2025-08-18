import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ActivityModel } from './activity.model';

@Injectable()
export class UserModel {
  constructor(
    @InjectRepository(User) private repo: Repository<User>, 
    private readonly activityModel: ActivityModel
  ) {}

  model () {
    return this.repo;
  }
}
