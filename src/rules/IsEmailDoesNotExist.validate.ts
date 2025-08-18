import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { AuthService } from "src/services/auth.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailDoesNotExistConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly authService: AuthService) {}

  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    const exist = await this.authService.verifyEmail(value);
    return exist ? false : true;
  }
}

export function IsEmailDoesNotExist(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsEmailDoesNotExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsEmailDoesNotExistConstraint,
    });
  };
}