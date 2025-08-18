import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsArray,
    IsNumber,
  } from 'class-validator'
import { IsPhone } from 'src/rules/IsPhone.validate'
  
  export class SignupDto {
    @IsEmail({}, { message: 'Email inválido' })
    email: string
  
    @IsString({ message: 'Nome inválido' })
    name: string
  
    @IsNumber({}, { message: 'Idade inválida' })
    age: number
  
    @IsString({ message: 'Ocupação inválida' })
    @IsNotEmpty({ message: 'Ocupação é obrigatória' })
    occupation: string
 
    @IsPhone({ message: 'Contato inválido' })
    @IsNotEmpty({ message: 'Contato é obrigatório' })
    contact: string
    
    @IsString({ message: 'Senha inválida' })
    @IsNotEmpty({ message: 'Senha é obrigatória' })
    password: string
  
    @IsOptional()
    role: 'user' | 'professional'
  }
  