import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordComplexityValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.value;

  if (!password) {
    return null;
  }

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasDigit = /\d/.test(password);

  const conditionsMet = [hasLowercase, hasUppercase, hasSpecialCharacter, hasDigit].filter(
    Boolean
  ).length;

  return conditionsMet >= 2 ? null : { passwordComplexity: true };
};
