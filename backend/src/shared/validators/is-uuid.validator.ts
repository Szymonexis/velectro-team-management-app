import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const DEFAULT_MASSAGE = 'Must be valid UUID';

@ValidatorConstraint({ async: false })
class IsUuidConstraint implements ValidatorConstraintInterface {
  validate(uuidString: string): boolean {
    if (typeof uuidString !== 'string') return false;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValid = uuidRegex.test(uuidString);

    return isValid;
  }

  defaultMessage(): string {
    return DEFAULT_MASSAGE;
  }
}

export function IsUuid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUuidConstraint,
    });
  };
}
