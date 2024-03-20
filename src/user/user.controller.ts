/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, ConflictException, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './DTO/CreateUser.dto';
import { User } from './user.entity';

@Controller('user')
export class UserController {

    constructor( private userService: UserService){}


   
        
    }

   

