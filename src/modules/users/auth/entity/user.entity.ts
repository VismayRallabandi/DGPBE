import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne } from 'typeorm';
import { AuthKey } from './auth-key.entity';
import { Locations } from '../../../gatepasses/form/entity/locations.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;
  
  @Column({ type: 'varchar', default: 'security' })
  role: string;

  @OneToMany(() => AuthKey, authKey => authKey.user)
  authKeys: AuthKey[];

  @ManyToOne(() => Locations, (location) => location.users)
  location: Locations; // Establishes the foreign key relationship
}