/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from 'src/user/user.entity';
import { parse } from 'uuid';
import * as crypto from 'crypto';



@Injectable()
export class AuthService {
  comparePasswords(password: string, password1: any) {
    throw new Error('Method not implemented.');
  }
    constructor( @InjectRepository(User) private readonly userRepository: Repository<User>,
    ){}

 async findOne(email: string): Promise<User  | undefined> {
        try {
          const user = this.userRepository.findOne({ where: { email } });
          return user;
        } catch (error) {
          return undefined;
        }
      }
      async findOneUser(email:string):Promise<User | undefined>{
        try{const user = this.userRepository.findOne({where:{email}})
        return user;}
        catch(error){
          return undefined
        }
      }

      async validateUserPassword(user: User, password: string): Promise<boolean> {
        return user.password === password;
      }
    
      
}
