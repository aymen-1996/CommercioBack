/* eslint-disable prettier/prettier */
// user.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService implements OnModuleInit {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async onModuleInit() {
    await this.createDefaultUser('mohmaeddhiabensaad@gmail.com', 'mohmaeddhia123', 'mohmaeddhiabensaad');
    await this.createDefaultUser('akrem.mejri.imfmm@gmail.com', 'akrem123', 'akrem mejri');
    await this.createDefaultUser('d.commercial@jax-delivery.com', 'commercial123', 'd.commercial');
    await this.createDefaultUser('hello@jax-delivery.com', 'hello123', 'hello');
  }

  private async createDefaultUser(email: string, password: string, nom: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({where:{email}})

    if (!existingUser) {
      const newUser = this.userRepository.create({ email, password, nom });
      await this.userRepository.save(newUser);
    }
  }
}
