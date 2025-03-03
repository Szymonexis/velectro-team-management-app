import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const DEFAULT_MASSAGE = 'Password and passwordConfirmation do not match';

@ValidatorConstraint({ async: false })
export class PasswordsMatchConstraint implements ValidatorConstraintInterface {
  validate(passwordConfirmation: any, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as [string];
    const password = (args.object as any)[relatedPropertyName];
    return password === passwordConfirmation;
  }

  defaultMessage(): string {
    return DEFAULT_MASSAGE;
  }
}

export function PasswordsMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: PasswordsMatchConstraint,
    });
  };
}
