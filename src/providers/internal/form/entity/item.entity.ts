import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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

    @ManyToOne(() => Form, form => form.items)
    form: Form;
}