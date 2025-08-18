import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn } from 'typeorm'

@Entity({ name: 'users', synchronize: true })
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    name: string

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string

    @Column({ type: 'int', default: 18 })
    age: number

    @Column({ type: 'varchar', length: 255, nullable: true })
    occupation: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    contact: string

    @Column({ type: 'varchar', length: 1020, nullable: true })
    photo: string

    @Column({ type: 'varchar', length: 255, default: 'user' })
    role: 'user' | 'admin' | 'professional'
    
    @Column({ type: 'varchar', length: 255, default: 'pt_BR' })
    language: 'pt_BR' | 'en'

    @Column({ type: 'varchar', length: 1020 })
    password: string
    
    @Column({ type: 'boolean', default: true })
    status: boolean
    
    @Column({ type: 'text', nullable: true })
    refresh_token: string
    
    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @DeleteDateColumn()
    deleted_at: Date
}