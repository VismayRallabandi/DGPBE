import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AuthKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.authKeys)
  @JoinColumn({ name: 'user' })
  user: User;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Add other relevant fields as needed, e.g., expiration date, type of key, etc.
}