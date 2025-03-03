import { FormControl } from '@angular/forms';

export interface EditTeamForm {
  name: FormControl<string | null>;
  address: FormControl<string | null>;
  range: FormControl<number | null>;
  description: FormControl<string | null>;
}
