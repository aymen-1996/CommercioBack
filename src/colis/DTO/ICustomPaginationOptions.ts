/* eslint-disable prettier/prettier */
import { IPaginationOptions } from "nestjs-typeorm-paginate";

export interface ICustomPaginationOptions extends IPaginationOptions {
    filters?: {
        nomCom?: string[]; 
      nomCL?: string[];     
      gov?: string[]; 
      date?: Date; 

    };
  }