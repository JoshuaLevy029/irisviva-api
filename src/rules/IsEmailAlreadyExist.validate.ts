import { Injectable } from "@nestjs/common";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { AuthService } from "src/services/auth.service";

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly authService: AuthService) {}

  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    return await this.authService.verifyEmail(value);
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsEmailAlreadyExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}