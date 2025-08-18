import { File } from 'buffer';
import { plainToClass } from 'class-transformer';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsFile', async: false })
export class IsFileConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    if (value && typeof value === 'object' && value.constructor === File) {
      if (
        [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'image/gif',
          'application/pdf',
        ].includes(value.type)
      ) {
        return true;
      }
    }

    return false;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `The field ${validationArguments.property} must be a valid file!`;
  }
}

export function IsFile(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsFileConstraint,
    });
  };
}
