import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vendors {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;
}
