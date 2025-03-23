import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'; // Decorator

@Entity() // Entity
export class User {
  @PrimaryGeneratedColumn() // PK & Auto Increase
  id?: number;

  @Column({ unique: true }) // Column, unique
  email: string;

  @Column({ nullable: true }) // Google OAuth 로그인을 감안하여 nullable 속성 부여
  password: string;

  @Column()
  username: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }) // Default value
  createdAt: Date = new Date();

  @Column({ nullable: true }) // Google OAuth 로그인에만 사용되는 속성이므로 nullable true 로 지정
  providerId: string;
}
