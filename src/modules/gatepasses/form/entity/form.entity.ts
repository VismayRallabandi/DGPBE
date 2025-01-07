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

    @Column({ nullable: true })
    date?: string | null;

    @Column({ nullable: true })
    time?: string | null;

    @Column()
    otherAddress: string;

    @Column()
    returnable: boolean;

    @Column({ nullable: true })
    securityPerson?: string | null;

    @OneToMany(() => Item, (item) => item.form, { cascade: true })
    items: Item[]

    @Column({ nullable: true })
    remarks?: string | null;

    @Column()
    requesterName: string;

    @Column({ nullable: true })
    dateofReturn: string;

    @Column({ type: 'boolean', default: false })
    approved: boolean;

    @Column({ default: 'vismay.rallabandi1023@gmail.com' })
    communityManager: string;

    @Column({type: 'boolean',default: false})
    completed: boolean;

    @Column({ nullable: true })
    invoiceNumber?: string | null;
}
