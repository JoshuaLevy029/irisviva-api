import { Injectable } from '@nestjs/common';

const bcrypt = require('bcrypt');

@Injectable()
export class HashService {
  async hash(value: string) {
    const saltRounds = 12;
    const hash = await bcrypt.hash(value, saltRounds);
    return hash;
  }

  async compare(value: string, hashed: string) {
    return await bcrypt.compare(value, hashed);
  }
}
