import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsMinString', async: false })
export class IsMinStringConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    const [min] = validationArguments.constraints;

    if (!value) {
      return false;
    }

    if (typeof value !== 'string' || (typeof value === 'string' && Number.isNaN(value))) {
      return false;
    }

    const numberValue = parseFloat(value);

    return numberValue >= min;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const [min] = validationArguments.constraints;

    if (!validationArguments.value) {
      return `The field ${validationArguments.property} is required`;
    }

    if (typeof validationArguments.value !== 'string' || (typeof validationArguments.value === 'string' && Number.isNaN(validationArguments.value))) {
      return `The field ${validationArguments.property} must be a valid number`;
    }

    const value = parseFloat(validationArguments.value);

    if (value < min) {
      return `The field ${validationArguments.property} must be greater than or equal to ${min}`;
    }

    return `The field ${validationArguments.property} must be a valid number`;
  }
}

export function IsMinString(min: number, validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsMinString',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min],
      options: validationOptions,
      validator: IsMinStringConstraint,
    });
  };
}
