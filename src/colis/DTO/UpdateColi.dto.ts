/* eslint-disable prettier/prettier */
export class UpdateColiDto{
    idC: number;
    code:string // Code Coli // ExelFile
    nomCl:string; //NomClient
    nomCom: string; //NomCommercial 
    gov: string; // Gouvernaurat
    ColLiv: number; //  nombre Colis Livré
    FrLiv: number; // Frais Livraison // insert f BD
    ColRtr: number; // nombre Colis Retour
    FrRtr: number; // Frais Retour // insert f BD
    Cr: number; // Contre Rembourcement 
    date:Date  // date paiement 
    TotpayEsp:number // Total paiement en especes from EXEL
    TotpayCheq:number // Total paiement par cheque from EXEL
    TotH:number // Total horaire jax from EXEL
    Restpay:number // reste a payer a espece from EXEL


// Calcul Chiffre Daffaire
    Global: number; // Global
    CaLiv: number; // CA Livraison
    caRtr: number; // CA Retour
    CaAutre: number; // CA Autre
    CrCa: number; // CR/CA // cr par rapport ca
    CaGlobal: number; // CA date /Global
    FLivMoy: number; // Frais Liv Moy
    FRtrMoy: number; // Frais Retour Moy

}