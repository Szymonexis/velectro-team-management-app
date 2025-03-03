import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const DEFAULT_MASSAGE =
  'Password must be between 8 and 20 characters and satisfy at least two of the following: one lowercase character, one uppercase character, one special character, or one digit.';

@ValidatorConstraint({ async: false })
class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    if (typeof password !== 'string') {
      return false;
    }

    // Check if the password has between 8 and 20 characters
    if (password.length < 8 || password.length > 20) {
      return false;
    }

    // Define the rules
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Check if at least 2 out of 4 rules are satisfied
    const validCriteriaCount = [
      hasLowerCase,
      hasUpperCase,
      hasDigit,
      hasSpecialChar,
    ].filter(Boolean).length;

    return validCriteriaCount >= 2;
  }

  defaultMessage(): string {
    return DEFAULT_MASSAGE;
  }
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordConstraint,
    });
  };
}
