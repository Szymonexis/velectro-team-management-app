import { FormControl } from '@angular/forms';

export interface EditInfoForm {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  isAdmin: FormControl<boolean | null>;
  canCreate: FormControl<boolean | null>;
  canDelete: FormControl<boolean | null>;
  canRead: FormControl<boolean | null>;
  canUpdate: FormControl<boolean | null>;
}
