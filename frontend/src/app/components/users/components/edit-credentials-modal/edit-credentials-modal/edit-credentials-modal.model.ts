import { FormControl } from '@angular/forms';

export interface EditCredentialsForm {
  username: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirmation: FormControl<string | null>;
}
