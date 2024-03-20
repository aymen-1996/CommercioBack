/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SB } from './sb.entity';
import { Repository } from 'typeorm';
import { CreateSBDto } from './DTO/CreateSB.dto';
import { ICustomPaginationOptions } from 'src/colis/DTO/ICustomPaginationOptions';
import { IPaginationMeta, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { Colis } from 'src/colis/colis.entity';
@Injectable()
export class SavebagService {
    constructor(
        @InjectRepository(SB) private sbRepository: Repository<SB>,
        @InjectRepository(Colis) private colisRepository: Repository<Colis>
        ) {}

        // creation savebag 
        async createSB(createSBDto: CreateSBDto): Promise<SB> {
          try {
              const colis = this.sbRepository.create(createSBDto);
      
              colis.date = new Date();
      
              const selectedNomCl = colis.nomCl;
      
              const existingColis = await this.colisRepository.findOne({
                where: {  nomCl: selectedNomCl  },
             
              });
      
              if (!existingColis) {
                  throw new NotFoundException(`Colis with nomCl ${selectedNomCl} not found.`);
              }
      
              colis.nomCom = existingColis.nomCom; 
              colis.gov = existingColis.gov; 
      
              colis.CaSbmf = colis.sbmf * colis.Psbmf;
              colis.CaSbgf = colis.sbgf * colis.Psbgf;
              colis.GlobalSb = colis.CaSbmf + colis.CaSbgf;
      
              return await this.sbRepository.save(colis);
          } catch (error) {
              console.error('Error creating savebag:', error);
              throw new InternalServerErrorException('Error creating savebag.');
          }
      }
      

 // Get ALL SB
 async getAllSB(): Promise<SB[]> {
    return await this.sbRepository.find();
}


async getAllSBClients(nomCL?: string): Promise<string[]> {
  try {
    const queryBuilder = this.sbRepository.createQueryBuilder('SB').select('DISTINCT SB.nomCl');

    // Add filtering by nomCL if it is provided
    if (nomCL) {
      queryBuilder.andWhere('SB.nomCl LIKE :nomCL', { nomCL: `%${nomCL}%` });
    }

    const clients = await queryBuilder.getRawMany();
    const clientNames = clients.map(SB => SB.nomCl);
    return clientNames;
  } catch (error) {
    console.error('Error getting clients:', error);
    throw new InternalServerErrorException('Error getting clients.');
  }
}


async getAllSBS(
  options: ICustomPaginationOptions,
): Promise<Pagination<SB, IPaginationMeta>> {
  const queryBuilder = this.sbRepository.createQueryBuilder('SB');

  if (options.filters) {
    if (options.filters.nomCL !== undefined) {
      if (Array.isArray(options.filters.nomCL) && options.filters.nomCL.length > 0) {
        queryBuilder.andWhere('SB.nomCL IN (:...nomCL)', { nomCL: options.filters.nomCL });
      } else if (typeof options.filters.nomCL === 'string') {
        queryBuilder.andWhere('SB.nomCL = :nomCL', { nomCL: options.filters.nomCL });
      }
    }

    if (options.filters.nomCom !== undefined) {
      if (Array.isArray(options.filters.nomCom) && options.filters.nomCom.length > 0) {
        queryBuilder.andWhere('SB.nomCom IN (:...nomCom)', { nomCom: options.filters.nomCom });
      } else if (typeof options.filters.nomCom === 'string') {
        queryBuilder.andWhere('SB.nomCom = :nomCom', { nomCom: options.filters.nomCom });
      }
    }

    if (options.filters.gov !== undefined) {
      if (Array.isArray(options.filters.gov) && options.filters.gov.length > 0) {
        queryBuilder.andWhere('SB.gov IN (:...gov)', { gov: options.filters.gov });
      } else if (typeof options.filters.gov === 'string') {
        queryBuilder.andWhere('SB.gov = :gov', { gov: options.filters.gov });
      }
    }

    if (options.filters && options.filters.date) {
      queryBuilder.andWhere('SB.date = :date', { date: options.filters.date });
    }
  }

  const paginationResult = await paginate<SB, IPaginationMeta>(queryBuilder, options);
  return paginationResult;
}
  //find SB par son id 
  async findSBbyid(idSB: number): Promise<SB> {
    try {
      const sb = await this.sbRepository.findOne({
        where: { idSB },
      });

      if (!sb) {
        throw new Error(`coli with ID ${idSB} not found`);
      }

      return sb;
    } catch (error) {
      throw new Error(`Error finding savebag: ${error.message}`);
    }
  }


  //update SB
  async updateSB(idSB: number, updateData: Partial<CreateSBDto>): Promise<SB> {
    try {
        let sb = await this.findSBbyid(idSB);

        sb = this.sbRepository.merge(sb, updateData);

        if ('sbmf' in updateData || 'Psbmf' in updateData) {
            sb.CaSbmf = sb.sbmf * sb.Psbmf;
        }

        if ('sbgf' in updateData || 'Psbgf' in updateData) {
            sb.CaSbgf = sb.sbgf * sb.Psbgf;
        }

        sb.GlobalSb = sb.CaSbmf + sb.CaSbgf;

        return await this.sbRepository.save(sb);
    } catch (error) {
        throw new Error(`Error updating savebag: ${error.message}`);
    }
}



async getAllCom(): Promise<string[]> {
  try {
      const nomComs = await this.sbRepository
          .createQueryBuilder('sb')
          .select('DISTINCT sb.nomCom')
          .getRawMany();

      const uniqueNomComs = nomComs.map(nomCom => nomCom.nomCom);
      return uniqueNomComs;
  } catch (error) {
      console.error('Error getting unique nomCom values:', error);
      throw new InternalServerErrorException('Error getting unique nomCom values.');
  }
}

async getchiffreById(idSB: number): Promise<{ nomCl: string, gov: string, nomCom: string, Global: number, CaSb: number, CaSbmf: number, CaSbgf: number }[]> {
  try {
      const sbList = await this.sbRepository.find({ where: { idSB } });

      const chiffreById = sbList.map(sb => ({
          nomCl: sb.nomCl,
          gov: sb.gov,
          nomCom: sb.nomCom,
          Global: sb.GlobalSb,
          CaSb: sb.CaSb,
          CaSbmf: sb.CaSbmf,
          CaSbgf: sb.CaSbgf,
      }));

      return chiffreById;
  } catch (error) {
      console.error('Error getting business figures by SB ID:', error);
      throw new InternalServerErrorException('Error getting business figures by SB ID.');
  }
}


async chiffreSB(options: ICustomPaginationOptions
  ): Promise<Pagination<{ nomCl: string, nomCom: string, gov: string,date:Date, GlobalSb: number, CaSbmf: number, CaSbgf: number }>> {
    try {
      const queryBuilder = this.sbRepository.createQueryBuilder('SB');
  
      if (options.filters) {
        if (options.filters.nomCL !== undefined) {
          if (Array.isArray(options.filters.nomCL) && options.filters.nomCL.length > 0) {
            queryBuilder.andWhere('SB.nomCL IN (:...nomCL)', { nomCL: options.filters.nomCL });
          } else if (typeof options.filters.nomCL === 'string') {
            queryBuilder.andWhere('SB.nomCL = :nomCL', { nomCL: options.filters.nomCL });
          }
        }
  
        if (options.filters.nomCom !== undefined) {
          if (Array.isArray(options.filters.nomCom) && options.filters.nomCom.length > 0) {
            queryBuilder.andWhere('SB.nomCom IN (:...nomCom)', { nomCom: options.filters.nomCom });
          } else if (typeof options.filters.nomCom === 'string') {
            queryBuilder.andWhere('SB.nomCom = :nomCom', { nomCom: options.filters.nomCom });
          }
        }
  
        if (options.filters.gov !== undefined) {
          if (Array.isArray(options.filters.gov) && options.filters.gov.length > 0) {
            queryBuilder.andWhere('SB.gov IN (:...gov)', { gov: options.filters.gov });
          } else if (typeof options.filters.gov === 'string') {
            queryBuilder.andWhere('SB.gov = :gov', { gov: options.filters.gov });
          }
        }
      }
     
      if (options.filters && options.filters.date) {
        queryBuilder.andWhere('SB.date = :date', { date: options.filters.date });
      }
   const paginationResult = await paginate(queryBuilder, options);
  
      return paginationResult;
      } catch (error) {
      console.error('Error getting business figures:', error);
      throw new InternalServerErrorException('Error getting business figures.');
    }
  }
  }



