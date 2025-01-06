import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';
import { User } from '../../../users/auth/entity/user.entity';



@Entity()
export class Locations {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    building_code: string;

    @Column({ type: 'varchar', length: 255 })
    building_address: string;

    @Column({ type: 'varchar', length: 100 })
    building_name: string;

    @Column({ type: 'varchar', length: 100, default: 'user2@example.com'})
    community_manager: string;

    // Define a relationship with User
    @OneToMany(() => User, (user) => user.location)
    users: User[];
}