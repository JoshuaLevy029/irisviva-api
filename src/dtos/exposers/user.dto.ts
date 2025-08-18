import { Expose } from "class-transformer";

export class UserDto {
    @Expose()
    id: number

    @Expose()
    name: string

    @Expose()
    email: string

    @Expose()
    age: number

    @Expose()
    occupation: string

    @Expose()
    contact: string

    @Expose()
    photo: string

    @Expose()
    role: 'user' | 'admin' | 'professional'
    
    @Expose()
    language: 'pt_BR' | 'en'

    @Expose()
    status: boolean
    
    @Expose()
    refresh_token: string

    @Expose()
    created_at: Date

    @Expose()
    updated_at: Date

    @Expose()
    accessToken: string
}