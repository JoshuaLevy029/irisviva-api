import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
  
@Entity({ name: 'activities', synchronize: true })
export class Activity {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ type: 'bigint', nullable: true })
    user_id: number;

    @Column({ type: 'varchar', nullable: true })
    action: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'json', nullable: true })
    data: any;

    @CreateDateColumn()
    executed_at: Date;
}
  