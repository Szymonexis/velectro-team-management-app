import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordKey: string,
  passwordConfirmationKey: string
): ValidatorFn {
  const validator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordKey)?.value;
    const passwordConfirmation = control.get(passwordConfirmationKey)?.value;

    return password && passwordConfirmation && password !== passwordConfirmation
      ? { passwordMismatch: true }
      : null;
  };

  return validator;
}
