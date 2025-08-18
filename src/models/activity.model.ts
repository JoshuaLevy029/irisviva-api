import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/entities/activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityModel {
  constructor(@InjectRepository(Activity) private repo: Repository<Activity>) {}

  create(data: {
    user_id: number;
    action: string;
    description: string;
    data?: any;
  }) {
    const activity = this.repo.create({ ...data });

    return this.repo.save(activity);
  }
}
