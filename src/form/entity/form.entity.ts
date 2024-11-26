import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Form{
    @Column()
    formType: 'inward' | 'outward';
    
    @Column()
    buildingName: string;

    @PrimaryGeneratedColumn()
    serialNumber: number;

    @Column()
    date: string;

    @Column()
    time: string;

    @Column()
    fromAddress: string;

    @Column()
    returnable: boolean;

    @Column()
    securityPerson: string;

    @Column()
    description: string;

    @Column()
    quantity: number;

    @Column()
    remarks: string;

    @Column()
    senderName: string;

    @Column()
    receiverName: string;

    @Column()
    dateofReturn: string;
}