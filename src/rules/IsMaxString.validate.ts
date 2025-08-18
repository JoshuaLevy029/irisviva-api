import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsMaxString', async: false })
export class IsMaxStringConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const [max] = validationArguments.constraints;

    if (!value) {
      return false;
    }

    if (typeof value !== 'string' || (typeof value === 'string' && Number.isNaN(value))) {
      return false;
    }

    const numberValue = parseFloat(value);

    return numberValue <= max;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const [max] = validationArguments.constraints;

    if (!validationArguments.value) {
      return `The field ${validationArguments.property} is required`;
    }

    if (typeof validationArguments.value !== 'string' || (typeof validationArguments.value === 'string' && Number.isNaN(validationArguments.value))) {
      return `The field ${validationArguments.property} must be a valid number`;
    }

    const value = parseFloat(validationArguments.value);

    if (value > max) {
      return `The field ${validationArguments.property} must be less than or equal to ${max}`;
    }

    return `The field ${validationArguments.property} must be a valid number`;
  }
}

export function IsMaxString(max: number, validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsMaxString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [max],
      options: validationOptions,
      validator: IsMaxStringConstraint,
    });
  };
}
