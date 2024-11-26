import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Form {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  message: string;

  // Add more fields as needed for your form
}
