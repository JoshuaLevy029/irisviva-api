import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { isCNPJ, isCPF } from "src/handlers/functions";

@ValidatorConstraint({ async: true })
export class IsCpfOrCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    if (!value) {
      return false;
    }

    return isCPF(value).status || isCNPJ(value).status;
  }

  defaultMessage(args: ValidationArguments): string {
    return `O campo "CPF/CNPJ" não é um cpf ou cnpj válido.`;
  }
}

export function IsCpfOrCnpj(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsCpfOrCnpj',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsCpfOrCnpjConstraint,
    });
  };
}