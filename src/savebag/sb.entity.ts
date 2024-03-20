/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'SB'})
export class SB {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    idSB: number;

    @Column()
    nomCl:string; //NomClient

    @Column()
    nomCom: string; //NomCommercial

    @Column()
    gov: string; // Gouvernaurat
    
    @Column("float")
    sbmf: number; //  nombre savebagmf

    @Column("float")
    Psbmf: number; // prix savebag mf

    @Column("float")
    sbgf: number; // nombre savebag gf

    @Column("float")
    Psbgf: number; // prix savebag gf

  
    @Column({ type: 'date' })
    date:Date // date paiement 

    @Column("float")
    CaSb: number; // CA Save bag

    //Calcul CA a faire apres creation coli
    @Column("float")
    GlobalSb: number; // CA Global savebag : GlobalSb = CaSbmf+ CaSbgf

    @Column("float")
    CaSbmf: number; // CA save bag mf : CaSbmf =sbmf*Psbmf

    @Column("float")
    CaSbgf:number; // CA sav bag gf : CaSbgf = sbgf*Psbgf

}