import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ async: true })
export class IsConfirmedConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
    const propertyName = validationArguments.property;
    const relatedValue = (validationArguments.object as any)[`${propertyName}_confirmation`];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments): string {
    const [propertyName] = args.constraints;
    return `Confirmation of ${propertyName} does not match`;
  }
}

export function IsConfirmed(property: string, validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsConfirmed',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsConfirmedConstraint,
    });
  };
}