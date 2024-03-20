/* eslint-disable prettier/prettier */

import {Column, Entity, OneToMany, PrimaryGeneratedColumn,} from "typeorm";

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: true }) 
    nom: string;
    @Column({ nullable: true }) 
    email: string;
    @Column({ nullable: true }) 
    password: string;



}

