/* eslint-disable prettier/prettier */
import { BadRequestException, InternalServerErrorException, UploadedFile, UseInterceptors, Controller, Post, Body, Get, ParseIntPipe, Param, Patch, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { ColisService } from './colis.service';
import { CreateColiDto } from './DTO/CreateColi.dto';
import { Colis } from './colis.entity';
import { UpdateColiDto } from './DTO/UpdateColi.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ICustomPaginationOptions } from './DTO/ICustomPaginationOptions';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';

@Controller('colis')
export class ColisController {

    constructor(private readonly colisService: ColisService) { }

    //Api create Coli : localhost:3000/colis/create
    @Post('create')
    createColi(@Body() createColiDto: CreateColiDto): Promise<Colis> {
        return this.colisService.createColi(createColiDto);
    }

    // API get all colis : localhost:3000/colis
    @Get()
    async GetAll(): Promise<Colis[]> {
        return this.colisService.getAll();
    }

    // Get Coli by id : localhost:3000/colis/id
    @Get(':id')
    async GetColibyId(@Param('id', ParseIntPipe) id: number): Promise<Colis> {
        return this.colisService.findColibyid(id);
    }

    //APi Update Coli par son id // localhost:3000/colis/1
    @Patch('id')
    @UsePipes(ValidationPipe)
    async UpdateColi(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateColiDto: UpdateColiDto): Promise<Colis> {
        return this.colisService.updateColi(id, updateColiDto)
    }

//post upload
    @Post('upload-excel')
    @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))  
    async uploadExcel(@UploadedFile() file: Express.Multer.File): Promise<{ message: string }> {
        try {
            if (!file) {
                throw new BadRequestException('No file uploaded.');
            }
    
            const data = await this.colisService.readExcel(file.path);
    
            if (data && data.length > 1) {
                const uniqueNomCls = new Set<string>();
                for (const row of data.slice(1)) {
                    if (Array.isArray(row) && row.length > 1) {
                        const nomClFromExcel = String(row[2]).trim().toLowerCase();
    
                        if (nomClFromExcel) {
                            uniqueNomCls.add(nomClFromExcel);
                        } else {
                            console.warn('Skipping row with empty nomCl:', row);
                        }
                    } else {
                        console.warn('Skipping invalid row:', row);
                    }
                }
                
                for (const nomCl of uniqueNomCls) {
                    console.log(`Processing nomCl: ${nomCl}`);
    
                    try {
                        const existingColisList = await this.colisService.findByNomCL(nomCl); // Change this line
                
                        const matchingRows = data.slice(1).filter(row => String(row[2]).trim().toLowerCase() === nomCl);
                
                        if (existingColisList && existingColisList.length > 0 && matchingRows.length > 0) {
                            const rowToUpdate = matchingRows[0];
                
                            // Assuming that existingColisList contains only one Colis, as findByNomCL returns a list
                            const existingColis = existingColisList[0];
                
                            existingColis.ColLiv = parseFloat(rowToUpdate[3]) || 0;
                            existingColis.ColRtr = parseFloat(rowToUpdate[4]) || 0;
                            existingColis.Cr = parseFloat(rowToUpdate[5]) || 0;
                            existingColis.TotpayEsp = parseFloat(rowToUpdate[6]) || 0;
                            existingColis.TotpayCheq = parseFloat(rowToUpdate[7]) || 0;
                            existingColis.TotH = parseFloat(rowToUpdate[8]) || 0;
                            existingColis.Restpay = parseFloat(rowToUpdate[9]) || 0;
                            existingColis.date = rowToUpdate[10];
                            existingColis.nomCom = rowToUpdate[11];
                
                            await this.colisService.saveDataFromExcel([existingColis]);
                
                            console.log('Data saved successfully.');
                        } else {
                            console.warn(`Record with nomCl '${nomCl}' not found in the database or no matching rows.`);
                        }
                    } catch (error) {
                        console.error(`Error processing nomCl '${nomCl}':`, error);
                    }
                }
    
                try {
                    const updatedColis = await this.colisService.findAndUpdateCalculations(uniqueNomCls);
    
                    console.log('Calculations updated successfully.');
                } catch (error) {
                    console.error('Error updating calculations:', error);
                    throw new InternalServerErrorException('Error updating calculations.');
                }
    
                return { message: 'Data uploaded successfully.' };
            } else {
                throw new BadRequestException('No valid data found in the Excel file.');
            }
        } catch (error) {
            console.error('Error in uploadExcel:', error);
            throw new InternalServerErrorException('Error uploading Excel file.');
        }
    }
    
    

    

    

    //liste de colis avec filtrage et pagination : localhost:3000/colis/getAllColis/1/10
    @Get('getAllColis/:page/:limit')
    async getAllColis(
        @Param('page', ParseIntPipe) page: number,
        @Param('limit', ParseIntPipe) limit: number,
        @Query('nomCL') nomCL?: string[],
        @Query('nomCom') nomCom?: string[],
        @Query('gov') gov?: string[],
        @Query('date') date?: Date,

    ): Promise<Pagination<Colis, IPaginationMeta>> {
        const options: ICustomPaginationOptions = {
            page,
            limit,
            filters: {
                nomCL,
                nomCom,
                gov,
                date,
            },
        };

        return this.colisService.getAllColis(options);
    }

    //liste clients // localhost:3000/colis/clients/all
    @Get('/clients/filtre')
    async getAllClientsfiltre(@Query('nomCL') nomCL?: string): Promise<string[]> {
        try {
            const clients = await this.colisService.getAllClientsfiltre(nomCL);
            return clients;
        } catch (error) {
            console.error('Error getting clients in controller:', error);
            throw new InternalServerErrorException('Error getting clients in controller.');
        }
    }

    //liste commerciaux // localhost:3000/colis/commerciaux/all
    @Get('/commerciaux/all')
    async getAllNomCom(): Promise<string[]> {
        try {
            const nomComs = await this.colisService.getAllCom();
            return nomComs;
        } catch (error) {
            console.error('Error getting unique nomCom values in controller:', error);
            throw new InternalServerErrorException('Error getting unique nomCom values in controller.');
        }
    }


    //listeChiffre 
     //localhost:3000/colis/chiffres/all/1/10
    @Get('chiffres/all/:page/:limit')
    async getChiffre(
        @Param('page', ParseIntPipe) page: number,
        @Param('limit', ParseIntPipe) limit: number,
        @Query('nomCom') nomCom?: string[],
        @Query('nomCL') nomCL?: string[],
        @Query('gov') gov?: string[],
        @Query('date') date?: Date,
    ): Promise<Pagination<{ nomCl: string, nomCom: string, gov: string, Global: number, CaLiv: number, caRtr: number, CaAutre: number, CrCa: number, FLivMoy: number, FRtrMoy: number }, IPaginationMeta>> {
        const options: ICustomPaginationOptions = {
            page,
            limit,
            filters: {
                nomCL,
                nomCom,
                gov,
                date
            },
        };

        return this.colisService.chiffre(options);
    }

    

    //liste chiffre by id
    @Get('chiffre/:iC/client')
    async getChiffreById(@Param('iC') iC: number): Promise<{ nomCl: string, Global: number, CaLiv: number, caRtr: number, CaAutre: number, CrCa: number, FLivMoy: number, FRtrMoy: number }[]> {
      try {
        const chiffreById = await this.colisService.getchiffreById(iC);
        return chiffreById;
      } catch (error) {
        console.error('Error in getChiffreById:', error);
        throw new InternalServerErrorException('Error getting business figures by iC.');
      }
    }


    //update coli par client //http://localhost:3000/colis
    @Patch()
    @UsePipes(ValidationPipe)
    async UpdateColiByNomCL(
        @Body('nomCl') nomCl: string,
        @Body() updateColiDto: UpdateColiDto,
    ): Promise<Colis> {
        return this.colisService.updateColiByNomCL(nomCl, updateColiDto);
    }

}
