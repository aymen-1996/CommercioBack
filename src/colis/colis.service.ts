/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Colis } from './colis.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateColiDto } from './DTO/CreateColi.dto';
import { UpdateColiDto } from './DTO/UpdateColi.dto';
import * as exceljs from 'exceljs';
import { IPaginationMeta, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ICustomPaginationOptions } from './DTO/ICustomPaginationOptions';
import * as XLSX from 'xlsx';
import { parse } from 'path';
import { OnModuleInit } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class ColisService  implements OnModuleInit{
  generateUniqueId: any;

    constructor(
        @InjectRepository(Colis) private colisRepository: Repository<Colis>) { }
        
  async onModuleInit(): Promise<void> {
    try {
  
      const file ='client.xlsx';
  
      const excelFilePath = path.resolve(__dirname, '..', '..', 'uploads', file);
  
  
  
      const data = await this.readExcel(excelFilePath);
  
      if (data && data.length > 0) {
        await this.saveClietsAll(data);
      }
    } catch (error) {
      console.error(error);
    }
  }
 
  async saveClietsAll(data: any[]): Promise<void> {
    try {
      for (const row of data.slice(2)) {
        const code = row[1];
        const nomClValue = row[2] !== undefined ? (typeof row[2] === 'object' && row[2].hasOwnProperty('text') ? row[2].text.toString() : row[2].toString()) : '';
  
        if (code && nomClValue) {
          let existingColis = await this.findOneByCodeAndNomCL(code, nomClValue);
  
          if (!existingColis) {
            const mapped = {
              Code: code,
              nomCl: nomClValue,
              FrLiv: row[3] !== undefined ? parseFloat(row[3]) : 0,
              FrRtr: row[4] !== undefined ? parseFloat(row[4]) : 0,
              ColRtr:0,
              nomCom:'',
              gov:'',
              TotpayEsp:0,
              TotpayCheq:0,
              TotH:0,
              Restpay:0,
              ColLiv:0,
              Cr:0,
              Global:0,
              CaLiv:0,
              caRtr:0,
              CaAutre:0,
              CrCa:0,
              CaGlobal:0,
              FLivMoy:0,
              FRtrMoy:0,
              date:null
           
            };
  
            await this.colisRepository.save(mapped);
          }
        }
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error saving data from Excel.');
    }
  }
  async findOneByCodeAndNomCL(code: string, nomCl: string): Promise<Colis | undefined> {
    try {
      const record = await this.colisRepository.findOne({
        where: { Code: code, nomCl }
      });
  
      return record;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Error finding record with code '${code}' and nomCL '${nomCl}'.");
    }
  }
  

  //update data pour client existe deja 
        //Read Data from Exel File
        async readExcel(filePath: string) {
          const workbook = new exceljs.Workbook();
          await workbook.xlsx.readFile(filePath);
        
          const worksheet = workbook.getWorksheet(1);
          const data = worksheet.getSheetValues();
        
          return data;
        }

        /*async saveDataFromExcel(data: any[]): Promise<void> {
          try {
              for (const row of data) {
                  const nomClFromExcel = row.nomCl;
                  const codeFromExcel = row.Code;
      
                  let existingColisByNomCl = await this.findOneByNomCL(nomClFromExcel);
      
                  if (existingColisByNomCl) {
                      existingColisByNomCl.Code = row.Code;
                      existingColisByNomCl.ColLiv += row.ColLiv;
                      existingColisByNomCl.ColRtr += row.ColRtr;
                      existingColisByNomCl.Cr += row.Cr;
                      existingColisByNomCl.TotpayEsp = row.TotpayEsp;
                      existingColisByNomCl.TotpayCheq = row.TotpayCheq;
                      existingColisByNomCl.TotH += row.TotH;
                      existingColisByNomCl.Restpay += row.Restpay;
                      existingColisByNomCl.date = row.date;
                      existingColisByNomCl.nomCom = row.nomCom;
                      existingColisByNomCl.Global = row.Global;
                      existingColisByNomCl.CaLiv = row.CaLiv;
                      existingColisByNomCl.caRtr = row.caRtr;
                      existingColisByNomCl.CaAutre = row.CaAutre;
                      existingColisByNomCl.CrCa = row.CrCa;
                      existingColisByNomCl.FLivMoy = row.FLivMoy;
                      existingColisByNomCl.FRtrMoy = row.FRtrMoy;
                      existingColisByNomCl.FrLiv += row.FrLiv;
                      existingColisByNomCl.gov = row.gov;
                      existingColisByNomCl.FrRtr += row.FrRtr;
      
                      await this.colisRepository.save(existingColisByNomCl);
                  } else {
                      const newColis = this.colisRepository.create({
                          nomCl: nomClFromExcel,
                          Code: codeFromExcel,
                          ColLiv: row.ColLiv,
                          ColRtr: row.ColRtr,
                          Cr: row.Cr,
                          TotpayEsp: row.TotpayEsp,
                          TotpayCheq: row.TotpayCheq,
                          TotH: row.TotH,
                          Restpay: row.Restpay,
                          date: row.date,
                          nomCom: row.nomCom,
                          Global: row.Global,
                          CaLiv: row.CaLiv,
                          caRtr: row.caRtr,
                          CaAutre: row.CaAutre,
                          CrCa: row.CrCa,
                          FLivMoy: row.FLivMoy,
                          FRtrMoy: row.FRtrMoy,
                          FrLiv: row.FrLiv,
                          gov: row.gov,
                          FrRtr: row.FrRtr,
                      });
      
                      // Save the newColis
                      await this.colisRepository.save(newColis);
                  }
              }
          } catch (error) {
              console.error('Error saving data from Excel:', error);
              throw new InternalServerErrorException('Error saving data from Excel.');
          }
      }*/


      async saveDataFromExcel(data: any[]): Promise<void> {
        try {
            for (const row of data) {
                const nomClFromExcel = row.nomCl;
    
                // Find all colis with the given nomCl
                const existingColisList = await this.findByNomCL(nomClFromExcel);
    
                for (let i = 0; i < existingColisList.length; i++) {
                    const existingColis = existingColisList[i];
    
                    existingColis.Code = row.Code;
                    existingColis.ColLiv += parseFloat(row.ColLiv) || 0;
                    existingColis.ColRtr += parseFloat(row.ColRtr) || 0;
                    existingColis.Cr += parseFloat(row.Cr) || 0;
                    existingColis.TotpayEsp += parseFloat(row.TotpayEsp) || 0;
                    existingColis.TotpayCheq += parseFloat(row.TotpayCheq) || 0;
                    existingColis.TotH += parseFloat(row.TotH) || 0;
                    existingColis.Restpay += parseFloat(row.Restpay) || 0;
                    existingColis.date = row.date;
                    existingColis.nomCom = row.nomCom;
                    existingColis.Global = parseFloat(row.Global) || 0;
                    existingColis.CaLiv = parseFloat(row.CaLiv) || 0;
                    existingColis.caRtr = parseFloat(row.caRtr) || 0;
                    existingColis.CaAutre = parseFloat(row.CaAutre) || 0;
                    existingColis.CrCa = parseFloat(row.CrCa) || 0;
                    existingColis.FLivMoy = parseFloat(row.FLivMoy) || 0;
                    existingColis.FRtrMoy = parseFloat(row.FRtrMoy) || 0;
                    existingColis.FrLiv = parseFloat(row.FrLiv) || 0;
                    existingColis.gov = row.gov;
                    existingColis.FrRtr = parseFloat(row.FrRtr) || 0;
    
                    // Save the updated existingColis
                    await this.colisRepository.save(existingColis);
                }
            }
        } catch (error) {
            console.error('Error saving data from Excel:', error);
            throw new InternalServerErrorException('Error saving data from Excel.');
        }
    }
    
    
    async findByNomCL(nomCl: string): Promise<Colis[]> {
        try {
            const records = await this.colisRepository.find({
                where: { nomCl }
            });
    
            if (records.length > 0) {
                console.log(`Found ${records.length} records for nomCL:`, nomCl);
                console.log('Found records:', records);
            } else {
                console.log('No records found for nomCL:', nomCl);
            }
    
            return records;
        } catch (error) {
            console.error('Error finding records with nomCL:', nomCl, error);
            throw new InternalServerErrorException(`Error finding records with nomCL '${nomCl}'.`);
        }
    }
    
    // Rest of your methods...
    
      async findOneByNomCL(nomCl: string): Promise<Colis | undefined> {
        try {
          const record = await this.colisRepository.findOne({
            where: { nomCl }
          });
      
          if (record) {
            console.log('Record found for nomCL:', nomCl);
            console.log('Found record:', record);
          } else {
            console.log('Record not found for nomCL:', nomCl);
          }
      
          return record;
        } catch (error) {
          console.error('Error finding record with nomCL:', nomCl, error);
          throw new InternalServerErrorException(`Error finding record with nomCL '${nomCl}'.`);
        }
      }
      
      async updateCalculations(colisData: Colis[]): Promise<void> {
        try {
            await Promise.all(colisData.map(async (colis) => {
                if (colis && colis.ColLiv !== null) {
                    colis.ColLiv = colis.ColLiv || 0;
                    colis.FrLiv = colis.FrLiv || 0;
                    colis.ColRtr = colis.ColRtr || 0;
    
                    colis.CaLiv = colis.ColLiv * colis.FrLiv;
                    colis.caRtr = colis.ColRtr * colis.FrRtr;
                    colis.CaAutre = colis.Cr - colis.CaLiv - colis.caRtr;
                    colis.Global = colis.CaLiv + colis.caRtr + colis.CaAutre;
    
                    colis.CrCa = colis.Cr / (colis.Global || 1);
                    colis.FLivMoy = colis.ColLiv !== 0 ? colis.CaLiv / colis.ColLiv : 0;
                    colis.FRtrMoy = colis.ColRtr !== 0 ? colis.caRtr / colis.ColRtr : 0;
    
                    await this.colisRepository.save(colis);
                } else {
                    console.warn('Skipping colis with null or undefined ColLiv:', colis);
                }
            }));
        } catch (error) {
            console.error('Error updating calculations:', error);
            throw error;
        }
    }
    
    async findAndUpdateCalculations(uniqueNomCls: Set<string>): Promise<void> {
        try {
            const colisData: Colis[] = [];
    
            for (const nomCl of uniqueNomCls) {
                const existingColisList = await this.findByNomCL(nomCl);
                colisData.push(...existingColisList);
            }
    
            await this.updateCalculations(colisData);
        } catch (error) {
            console.error('Error finding and updating calculations:', error);
            throw error;
        }
    }
        
//liste colis
async getAllColis(
  options: ICustomPaginationOptions,
): Promise<Pagination<Colis, IPaginationMeta>> {
  const queryBuilder = this.colisRepository.createQueryBuilder('colis');

  if (options.filters) {
    if (options.filters.nomCL !== undefined) {
      if (Array.isArray(options.filters.nomCL) && options.filters.nomCL.length > 0) {
        queryBuilder.andWhere('colis.nomCL IN (:...nomCL)', { nomCL: options.filters.nomCL });
      } else if (typeof options.filters.nomCL === 'string') {
        queryBuilder.andWhere('colis.nomCL = :nomCL', { nomCL: options.filters.nomCL });
      }
    }

    if (options.filters.nomCom !== undefined) {
      if (Array.isArray(options.filters.nomCom) && options.filters.nomCom.length > 0) {
        queryBuilder.andWhere('colis.nomCom IN (:...nomCom)', { nomCom: options.filters.nomCom });
      } else if (typeof options.filters.nomCom === 'string') {
        queryBuilder.andWhere('colis.nomCom = :nomCom', { nomCom: options.filters.nomCom });
      }
    }

    if (options.filters.gov !== undefined) {
      if (Array.isArray(options.filters.gov) && options.filters.gov.length > 0) {
        queryBuilder.andWhere('colis.gov IN (:...gov)', { gov: options.filters.gov });
      } else if (typeof options.filters.gov === 'string') {
        queryBuilder.andWhere('colis.gov = :gov', { gov: options.filters.gov });
      }
    }

    if (options.filters && options.filters.date) {
      queryBuilder.andWhere('colis.date = :date', { date: options.filters.date });
    }
  }

  const paginationResult = await paginate<Colis, IPaginationMeta>(queryBuilder, options);
  return paginationResult;
}





    // creation Coli 
    async createColi(createColiDto: CreateColiDto): Promise<Colis> {
      try {
        const selectedNomCl = createColiDto.nomCl;
    
        const existingColis = await this.colisRepository.findOne({
          where: { nomCl: selectedNomCl },
        });
    
        if (existingColis) {
          existingColis.nomCom = createColiDto.nomCom || existingColis.nomCom;
          existingColis.gov = createColiDto.gov || existingColis.gov;
          existingColis.FrLiv = createColiDto.FrLiv || existingColis.FrLiv;
          existingColis.FrRtr = createColiDto.FrRtr || existingColis.FrRtr;
          existingColis.ColLiv = +(existingColis.ColLiv || 0) + Number(createColiDto.ColLiv);
          existingColis.ColRtr = +(existingColis.ColRtr || 0) + Number(createColiDto.ColRtr);
          existingColis.Cr = +(existingColis.Cr || 0) + Number(createColiDto.Cr);
          existingColis.CaAutre = +(existingColis.CaAutre || 0) + Number(createColiDto.CaAutre);

          existingColis.CaLiv = existingColis.ColLiv * existingColis.FrLiv;
          existingColis.caRtr = existingColis.ColRtr * existingColis.FrRtr;
          existingColis.Global = existingColis.CaLiv + existingColis.caRtr + existingColis.CaAutre;
          existingColis.CrCa = existingColis.Global !== 0 ? existingColis.Cr / existingColis.Global : 0;
          existingColis.FLivMoy = existingColis.ColLiv !== 0 ? existingColis.CaLiv / existingColis.ColLiv : 0;
          existingColis.FRtrMoy = existingColis.ColRtr !== 0 ? existingColis.caRtr / existingColis.ColRtr : 0;
    
          const updatedColis = await this.colisRepository.save(existingColis);
    
          return updatedColis;
        } else {
          throw new NotFoundException(`Colis with nomCl ${selectedNomCl} not found.`);
        }
      } catch (error) {
        console.error('Error updating colis:', error);
        throw new InternalServerErrorException('Error updating colis.');
      }
    }
    
    
    
    
    
    
    

    // Get ALL Colis
    async getAll(): Promise<Colis[]> {
        return await this.colisRepository.find();
    }

    async findColibyid(iC: number): Promise<Colis> {
      try {
        const coli = await this.colisRepository.findOne({
          where: { iC },
        });
  
        if (!coli) {
          throw new Error(`coli with ID ${iC} not found`);
        }
  
        return coli;
      } catch (error) {
        throw new Error(`Error finding coli: ${error.message}`);
      }
    }
  
    //update coli 
    async updateColi(id: number, updateColiDto: UpdateColiDto): Promise<Colis> {
        let colis = await this.colisRepository.findOneBy({
            iC: id,
        })
        colis = { ...colis, ...updateColiDto, };
        return await this.colisRepository.save(colis);
    }

 //getclient
 async getAllClientsfiltre(nomCL?: string): Promise<string[]> {
  try {
    const queryBuilder = this.colisRepository.createQueryBuilder('colis').select('DISTINCT colis.nomCl');

    if (nomCL) {
      queryBuilder.andWhere('colis.nomCl LIKE :nomCL', { nomCL: `%${nomCL}%` });
    }

    const clients = await queryBuilder.getRawMany();

    const clientNames = clients.map((client) => client.nomCl);
    return clientNames;
  } catch (error) {
    console.error('Error getting clients:', error);
    throw new InternalServerErrorException('Error getting clients.');
  }
}


 //liste commerciaux 
 async getAllCom(): Promise<string[]> {
  try {
      const nomComs = await this.colisRepository
          .createQueryBuilder('colis')
          .select('DISTINCT colis.nomCom')
          .getRawMany();

      const uniqueNomComs = nomComs.map(nomCom => nomCom.nomCom);
      return uniqueNomComs;
  } catch (error) {
      console.error('Error getting unique nomCom values:', error);
      throw new InternalServerErrorException('Error getting unique nomCom values.');
  }
}

//chiffre coli 
async chiffre(options: ICustomPaginationOptions): Promise<Pagination<{ nomCl: string; date:Date;nomCom: string; gov: string; Global: number; CaLiv: number; caRtr: number; CaAutre: number; CrCa: number; FLivMoy: number; FRtrMoy: number }>> {
  try {
    const queryBuilder = this.colisRepository.createQueryBuilder('colis');

    if (options.filters) {
      if (options.filters.nomCL !== undefined) {
        if (Array.isArray(options.filters.nomCL) && options.filters.nomCL.length > 0) {
          queryBuilder.andWhere('colis.nomCL IN (:...nomCL)', { nomCL: options.filters.nomCL });
        } else if (typeof options.filters.nomCL === 'string') {
          queryBuilder.andWhere('colis.nomCL = :nomCL', { nomCL: options.filters.nomCL });
        }
      }

      if (options.filters.nomCom !== undefined) {
        if (Array.isArray(options.filters.nomCom) && options.filters.nomCom.length > 0) {
          queryBuilder.andWhere('colis.nomCom IN (:...nomCom)', { nomCom: options.filters.nomCom });
        } else if (typeof options.filters.nomCom === 'string') {
          queryBuilder.andWhere('colis.nomCom = :nomCom', { nomCom: options.filters.nomCom });
        }
      }

      if (options.filters.gov !== undefined) {
        if (Array.isArray(options.filters.gov) && options.filters.gov.length > 0) {
          queryBuilder.andWhere('colis.gov IN (:...gov)', { gov: options.filters.gov });
        } else if (typeof options.filters.gov === 'string') {
          queryBuilder.andWhere('colis.gov = :gov', { gov: options.filters.gov });
        }
      }
    }


    if (options.filters && options.filters.date) {
      queryBuilder.andWhere('colis.date = :date', { date: options.filters.date });
    }

    const paginationResult = await paginate(queryBuilder, options);

    return paginationResult;
  } catch (error) {
    console.error('Error getting business figures:', error);
    throw new InternalServerErrorException('Error getting business figures.');
  }
}
      
/*
//liste chiffre d affaire par filtrage
async chiffre(filters?: {
  nomCom?: string[]; 
  nomCL?: string[];     
  gov?: string[]; 
}): Promise<{ nomCl: string; nomCom: string, gov: string, Global: number, CaLiv: number, caRtr: number, CaAutre: number, CrCa: number, FLivMoy: number, FRtrMoy: number }[]> {
  try {
    const queryBuilder = this.colisRepository.createQueryBuilder('colis');

    if (filters) {
      if (filters.nomCL !== undefined) {
        if (Array.isArray(filters.nomCL) && filters.nomCL.length > 0) {
          queryBuilder.andWhere('colis.nomCL IN (:...nomCL)', { nomCL: filters.nomCL });
        } else if (typeof filters.nomCL === 'string') {
          queryBuilder.andWhere('colis.nomCL = :nomCL', { nomCL: filters.nomCL });
        }
      }

      if (filters.nomCom !== undefined) {
        if (Array.isArray(filters.nomCom) && filters.nomCom.length > 0) {
          queryBuilder.andWhere('colis.nomCom IN (:...nomCom)', { nomCom: filters.nomCom });
        } else if (typeof filters.nomCom === 'string') {
          queryBuilder.andWhere('colis.nomCom = :nomCom', { nomCom: filters.nomCom });
        }
      }

      if (filters.gov !== undefined) {
        if (Array.isArray(filters.gov) && filters.gov.length > 0) {
          queryBuilder.andWhere('colis.gov IN (:...gov)', { gov: filters.gov });
        } else if (typeof filters.gov === 'string') {
          queryBuilder.andWhere('colis.gov = :gov', { gov: filters.gov });
        }
      }
    }

    const colisList = await queryBuilder.getMany();

    const chiffre = colisList.map(colis => ({
      nomCl: colis.nomCl,
      nomCom:colis.nomCom,
      gov:colis.gov,
      Global: colis.Global,
      CaLiv: colis.CaLiv,
      caRtr: colis.caRtr,
      CaAutre: colis.CaAutre,
      CrCa: colis.CrCa,
      FLivMoy: colis.FLivMoy,
      FRtrMoy: colis.FRtrMoy,
    }));

    return chiffre;
  } catch (error) {
    console.error('Error getting business figures:', error);
    throw new InternalServerErrorException('Error getting business figures.');
  }
}*/

// liste chiffre byid colis
async getchiffreById(iC: number): Promise<{ nomCl:string ,Global: number, CaLiv: number, caRtr: number, CaAutre: number, CrCa: number, FLivMoy: number, FRtrMoy: number }[]> {
  try {
    const colisList = await this.colisRepository.find({ where: { iC } });

    const chiffreById = colisList.map(colis => ({
      nomCl: colis.nomCl,
      Global: colis.Global,
      CaLiv: colis.CaLiv,
      caRtr: colis.caRtr,
      CaAutre: colis.CaAutre,
      CrCa: colis.CrCa,
      FLivMoy: colis.FLivMoy,
      FRtrMoy: colis.FRtrMoy,
    }));

    return chiffreById;
  } catch (error) {
    console.error('Error getting business figures by client ID:', error);
    throw new InternalServerErrorException('Error getting business figures by client ID.');
  }
}

//
async updateColiByNomCL(nomCl: string, updateColiDto: UpdateColiDto): Promise<Colis> {
  try {
    const existingColis = await this.findOneByNomCL(nomCl);

    if (!existingColis) {
      throw new Error('Colis with nomCl ${nomCl} not found');
    }

    Object.assign(existingColis, updateColiDto);

    existingColis.Global = existingColis.CaLiv + existingColis.caRtr + existingColis.CaAutre;
    existingColis.CaLiv = existingColis.ColLiv * existingColis.FrLiv;
    existingColis.caRtr = existingColis.ColRtr * existingColis.FrRtr;
    existingColis.CaAutre = existingColis.Cr - existingColis.CaLiv - existingColis.caRtr;
    existingColis.CrCa = existingColis.Cr / existingColis.Global;
    existingColis.FLivMoy = existingColis.ColLiv !== 0 ? existingColis.CaLiv / existingColis.ColLiv : 0;
    existingColis.FRtrMoy = existingColis.ColRtr !== 0 ? existingColis.caRtr / existingColis.ColRtr : 0;

    const numericCr: number = parseFloat(existingColis.Cr as unknown as string);
    const numericFrRtr: number = parseFloat(existingColis.FrRtr as unknown as string);
    const numericColRtr: number = parseFloat(existingColis.ColRtr as unknown as string);

    if (Number.isFinite(numericCr) && existingColis.Global !== 0) {
      existingColis.CrCa = numericCr / existingColis.Global;
    } else {
      existingColis.CrCa = 0;
    }

    if (Number.isFinite(numericCr) && Number.isFinite(numericColRtr) && Number.isFinite(numericFrRtr) && existingColis.Global !== 0) {
      existingColis.caRtr = numericColRtr * numericFrRtr;
      existingColis.CaAutre = numericCr - existingColis.CaLiv - existingColis.caRtr;
    } else {
      existingColis.caRtr = 0;
      existingColis.CaAutre = 0;
    }

    await this.colisRepository.save(existingColis);

    return existingColis;
  } catch (error) {
    console.error('Error updating colis with nomCl : ${nomCl}', error);
    throw new InternalServerErrorException('Error updating colis with nomCl : ${nomCl}');
  }
}


}