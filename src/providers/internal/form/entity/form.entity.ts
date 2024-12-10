import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Item } from "./item.entity";
@Entity()
export class Form{
    @Column()
    formType: 'inward' | 'outward';
    
    @Column()
    buildingName: string;

    @PrimaryGeneratedColumn()
    serialNumber: number;

    @Column({ default: () => 'CURRENT_DATE' })
    idate: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP::time' })
    itime: string;

    @Column()
    date: string;

    @Column()
    time: string;

    @Column()
    otherAddress: string;

    @Column()
    returnable: boolean;

    @Column()
    securityPerson: string;

    @OneToMany(() => Item, (item) => item.form, { cascade: true })
    items: Item[]

    @Column()
    remarks: string;

    @Column()
    requesterName: string;

    @Column({ nullable: true })
    dateofReturn: string;

    @Column({ default: false })
    approved: boolean;

    @Column({ default: 'vismay.rallabandi1023@gmail.com' })
    signator: string;
}
