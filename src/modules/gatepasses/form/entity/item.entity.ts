import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Form } from "./form.entity";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;    

    @Column()
    quantity: number;

    @Column()
    itemCode: string; 

    @Column()
    modelName: string; 

    @ManyToOne(() => Form, form => form.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'formId' })
    form: Form;

    @Column()
    formId: number;
}