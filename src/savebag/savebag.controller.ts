/* eslint-disable prettier/prettier */
import { Body, Controller, Post,Get, Param, ParseIntPipe, Put, NotFoundException, Query, InternalServerErrorException } from '@nestjs/common';
import { SavebagService } from './savebag.service';
import { SB } from './sb.entity';
import { CreateSBDto } from './DTO/CreateSB.dto';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { ICustomPaginationOptions } from 'src/colis/DTO/ICustomPaginationOptions';

@Controller('savebag')
export class SavebagController {

    constructor( private readonly savebagService: SavebagService) {}


    //Api create Coli : localhost:3000/savebag/create
    @Post('create')
    createSB(@Body() createSBDto: CreateSBDto): Promise<SB> {
        return this.savebagService.createSB(createSBDto);
    }


    @Get('getAll/:page/:limit')
    async getAllSBS(
        @Param('page', ParseIntPipe) page: number,
        @Param('limit', ParseIntPipe) limit: number,
        @Query('nomCL') nomCL?: string[],
        @Query('nomCom') nomCom?: string[],
        @Query('gov') gov?: string[],
        @Query('date') date?: Date,

    ): Promise<Pagination<SB, IPaginationMeta>> {
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
        return this.savebagService.getAllSBS(options);
    }

    // API get all colis : localhost:3000/savebag
    @Get()
    async GetAll(): Promise<SB[]> {
        return this.savebagService.getAllSB();
    }

      // Get SB by id : localhost:3000/savebag/id
      @Get(':id')
      async GetColibyId(@Param('id', ParseIntPipe) id: number): Promise<SB> {
          return this.savebagService.findSBbyid(id);
      }

      @Get('/sbclients/all')
      async getAllClients(@Query('nomCL') nomCL?: string): Promise<string[]> {
        try {
          const clients = await this.savebagService.getAllSBClients(nomCL);
        
          return clients;
        } catch (error) {
          console.error('Error getting clients in controller:', error);
          throw new InternalServerErrorException('Error getting clients in controller.');
        }
      }
      @Put(':idSB/sb')
      async updateSavebag(
          @Param('idSB') idSB: number,
          @Body() updateData: CreateSBDto,
      ): Promise<SB> {
          try {
              await this.savebagService.findSBbyid(idSB);
  
              const updatedSavebag = await this.savebagService.updateSB(idSB, updateData);
  
              return updatedSavebag;
          } catch (error) {
              if (error instanceof NotFoundException) {
                  throw new NotFoundException(`Savebag with ID ${idSB} not found`);
              } else {
                  throw new Error(`Error updating Savebag: ${error.message}`);
              }
          }
      }


      @Get('Com/all')
    async getAllUniqueNomComs(): Promise<string[]> {
        return this.savebagService.getAllCom();
    }


    @Get('chiffreById/:idSB')
    async getchiffreById(@Param('idSB') idSB: number): Promise<{ nomCl: string, gov: string, nomCom: string, Global: number, CaSb: number, CaSbmf: number, CaSbgf: number }[]> {
        return this.savebagService.getchiffreById(idSB);
    }


    @Get('chiffresSB/all/:page/:limit')
    async getChiffreSB(
        @Param('page', ParseIntPipe) page: number,
        @Param('limit', ParseIntPipe) limit: number,
        @Query('nomCL') nomCL?: string[],
        @Query('nomCom') nomCom?: string[],
        @Query('gov') gov?: string[],
        @Query('date') date?:Date,

    ): Promise<Pagination<{ nomCl: string, nomCom: string, gov: string, date:Date, GlobalSb: number, CaSbmf: number, CaSbgf: number } ,  IPaginationMeta>> {
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

        return this.savebagService.chiffreSB(options);
    }

}
