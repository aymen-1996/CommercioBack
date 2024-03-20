/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'Colis'})
export class Colis {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    iC: number;

    @Column({ nullable: true }) 
    Code:string; //code

    @Column({ nullable: true })
    nomCl:string; //NomClient

    @Column({ nullable: true })
    nomCom: string; //NomCommercial

    @Column({ nullable: true })
    gov: string; // Gouvernaurat
    
    @Column("float", { nullable: true })
    TotpayEsp:number // Total paiement en especes from EXEL

    @Column("float", { nullable: true })
    TotpayCheq:number // Total paiement par cheque from EXEL

    @Column("float", { nullable: true })
    TotH:number // Total horaire jax from EXEL

    @Column("float", { nullable: true })
    Restpay:number // reste a payer a espece from EXEL
    @Column("float", { nullable: true })
    ColLiv: number; // Colis Livré

    @Column("float", { nullable: true })
    FrLiv: number; // Frais Livraison // insert f BD

    @Column("float", { nullable: true })
    ColRtr: number; //  Colis Retour

    @Column("float", { nullable: true })
    FrRtr: number; // Frais Retour // insert f BD

    @Column("float", { nullable: true })
    Cr: number; // Contre Rembourcement

    @Column("float", { nullable: true })
    Global: number; // Global

    @Column("float", { nullable: true })
    CaLiv: number; // CA Livraison

    @Column("float", { nullable: true })
    caRtr: number; // CA Retour

    @Column("float", { nullable: true })
    CaAutre: number; // CA Autre

    @Column("float", { nullable: true })
    CrCa: number; // CR/CA // cr par rapport ca    

    @Column("float", { nullable: true })
    CaGlobal: number; // CA date /Global

    @Column("float", { nullable: true })
    FLivMoy: number; // Frais Liv Moy

    @Column("float", { nullable: true })
    FRtrMoy: number; // Frais Retour Moy

    @Column({ type: 'date', nullable: true })
    date:Date // date paiement 
   
}

