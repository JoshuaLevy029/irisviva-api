import axios from "axios";
import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import Http from "src/enums/http";
import { isCNPJ, isCPF } from "src/handlers/functions";

@ValidatorConstraint({ async: true })
export class reCaptchaConstraint implements ValidatorConstraintInterface {
  async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
    if (!value) {
      return false;
    }

    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${value}`);

    if (Http.failed(response.status)) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    if (!args.value) {
      return `Invalid reCaptcha response`;
    }

    return `Invalid reCaptcha response`;
  }
}

export function reCaptcha(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'reCaptcha',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: reCaptchaConstraint,
    });
  };
}