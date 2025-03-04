/* eslint-disable prettier/prettier */
export class CreateSBDto {
    idSB: number;
    nomCl:string; //NomClient  
    nomCom: string; //NomCommercial
    gov: string; // Gouvernaurat 
    sbmf: number; //  nombre savebagmf
    Psbmf: number; // prix savebag mf
    sbgf: number; // nombre savebag gf
    Psbgf: number; // prix savebag gf
    date:Date  // date paiement 
    CaSb: number; // CA Save bag

    //Calcul CA a faire apres creation coli
    GlobalSb: number; // CA Global savebag
    CaSbmf: number; // CA save bag mf
    CaSbgf:number; // CA sav bag gf

}