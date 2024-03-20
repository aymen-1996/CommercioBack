/* eslint-disable prettier/prettier */
import { IPaginationOptions } from "nestjs-typeorm-paginate";
export interface ICustomPaginationOptions extends IPaginationOptions {
    filters?: {
      nomCL?: string[]; 
        nomCom?: string[];     
      gov?: string[]; 
      date?: Date; 

    };
  }